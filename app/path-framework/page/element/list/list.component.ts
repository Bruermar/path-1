import {IListHandler, IList, IButtonHandler, IKey, IPathApp, IButton} from "../../../pathinterface";
import {PathService} from "../../../service/path.service";
import {AfterViewInit, Component, Input, Output} from "@angular/core";
import {ButtonGroup} from "../button-group/button-group.component";
import {Key, PageElement} from "../page-element";
import {TranslationService} from "../../../service/translation.service";
import {KeyUtility} from "../../../utility/key-utility";
import {Button} from "../button/button.component";
import {LinkButton} from "../button/link-button.component";
import {FocusUtility} from "../../../form/focus-utility";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";

@Component({
    selector: "path-list",
    templateUrl: "list.component.html"
})
export class ListComponent implements AfterViewInit {
    @Input("list")
    @Output("list")
    list: List;

    ngAfterViewInit() {
        FocusUtility.focusFirstField(null);
    }
}

export class List extends PageElement implements IList {
    private _buttonGroups: ButtonGroup[] = [];
    private _search: boolean;
    private _limit: number;
    private _searchRequired: boolean;
    private _searchRequest: boolean;
    private _searchLabel: string;
    private _searchInputLabel: string;
    private _searchText: string;
    private _searchTextChanged: Subject<string> = new Subject<string>();
    private _handler: IListHandler;
    private _buttonHandler: IButtonHandler;
    private _icon: string;
    private _color: string;
    private _form: string;
    private _formHandler: string;
    private _page: string;
    private _mockData: any;
    private _url: string;

    constructor(app: IPathApp, private pathService: PathService, private translationService: TranslationService) {
        super(app);
        this._searchLabel = translationService.getText("Search");
        this._searchInputLabel = translationService.getText("SearchInputLabel");
    }

    public getContent(): IButton[] {
        const buttons: Button[] = [];
        for (const buttonGroup of this.buttonGroups) {
            buttons.push(...buttonGroup.buttons);
        }
        return buttons;
    }

    public refresh(searchText: string, afterRefreshHandler: () => void) {
        // callback function for data
        console.log("refresh list");
        const dataHandler = (data: any) => {
            const oldButtonGroups = this.buttonGroups;
            this.buttonGroups = [];
            for (const item of data) {
                // create button or find existing button
                const itemKey: Key = new Key(item["key"]["key"], item["key"]["name"]);
                let buttonGroup: ButtonGroup = this.findButtonGroup(itemKey, oldButtonGroups);
                if (buttonGroup == null) {
                    // create button
                    if (item["type"] == null) {
                        item["type"] = "button";
                    }
                    const pageElements = this.app.createPageElement(item, this.parentPageElement);
                    buttonGroup = <ButtonGroup>pageElements[0];
                    for (const button of buttonGroup.buttons) {
                        button.listElement = true;
                    }
                }
                // build button from json
                // use list defaults if button does not specify model
                for (const button of buttonGroup.buttons) {
                    if (item["icon"] == null) {
                        item["icon"] = this.icon;
                    }
                    if (item["color"] == null) {
                        item["color"] = this.color;
                    }
                    if (item["page"] == null) {
                        item["page"] = this.page;
                    }
                    if ((item["form"] == null || item["form"]["form"] == null) && this.form != null) {
                        item["form"] = {};
                        item.form["form"] = this.form;
                        item.form["handler"] = this.formHandler;
                    }
                    // special default width (2 instead of 1) for buttons in list
                    if (item["width"] == null) {
                        item["width"] = this.width;
                    }
                    button.fromJson(item);

                    // special values for list buttons
                    button.handler = this._buttonHandler;
                    button.name = item.name; // no translation
                    button.tooltip = item.tooltip; // no translation
                }
                this.buttonGroups.push(buttonGroup);
            }
            if (this.handler != null) {
                this.handler.doLoad(this); // TODO useful?
            }
            if (this.limit) {
                this.setSearchResultsCountMessage();
            }
            if (afterRefreshHandler != null) {
                window.setTimeout(() => {
                    afterRefreshHandler();
                }, 1);
            }
        };
        const listHandlerDoLoad = (list: IList) => (data: any) => dataHandler(data);
        // backend data
        if (this._url != null) {
            let urlParameters = "";
            if (searchText || this.limit) {
                urlParameters = "?search=" + (searchText == null ? "" : encodeURI(searchText)) + "&limit=" + this.limit;
            }
            this.pathService.serverGet(this.app.getBackendUrl(), this.url + urlParameters, listHandlerDoLoad(this), null);
        }
        // mock data
        if (this._mockData != null) {
            let count = 0;
            // fake a key for mock data
            for (const mock of this.mockData) {
                count++;
                if (mock["key"] == null) {
                    mock["key"] = count;
                }
            }
            dataHandler(this.mockData);
        }
    }

    private findButtonGroup(key: IKey, buttonGroups: ButtonGroup[]): ButtonGroup {
        for (const buttonGroup of buttonGroups) {
            for (const button of buttonGroup.buttons) {
                if (button.key.getKey() === key.getKey() && button.key.getName() === key.getName()) {
                    return buttonGroup;
                }
            }
        }
        return null;
    }

    public filterChanged(text: string) {
        this._searchTextChanged.next(text);
    }

    public filter() {
        this._searchLabel = this.translationService.getText("Search");
        if (this._searchText && this._searchText === "*") {
            this.refresh(null, null);
        } else if (this.searchRequest) {
            // call server to filter data
            if (!this._searchText && this.searchRequired) {
                this._buttonGroups = [];
            } else if (this._searchText === "*" || (!this._searchText && !this.searchRequired)) {
                this.refresh(null, null);
            } else if (this._searchText && this._searchText.length >= 2) {
                this.refresh(this._searchText, null);
            } else {
                this._searchLabel = this.translationService.getText("SearchTextTooShort");
                this._buttonGroups = [];
            }
        } else {
            // filter loaded data only
            const searchText: string = this._searchText ? this._searchText.toLowerCase() : "";
            for (const buttonGroup of this._buttonGroups) {
                buttonGroup.visible = true;
                for (const button of buttonGroup.buttons) {
                    if (searchText.length > 0) {
                        let newVisible: boolean = button.name.toLowerCase().indexOf(searchText) !== -1;
                        if (!newVisible) {
                            for (const detail of button.details) {
                                if (detail.text.toLowerCase().indexOf(searchText) !== -1) {
                                    newVisible = true;
                                    break;
                                }
                            }
                        }
                        buttonGroup.visible = newVisible;
                        this.setSearchResultsCountMessage();
                        break;
                    }
                }
            }
        }
    }

    private setSearchResultsCountMessage() {
        this._searchLabel = this.visibleItemSize() + " " +
            (this.visibleItemSize() === 1 ? this.translationService.getText("Result") : this.translationService.getText("Results"));
    }

    private visibleItemSize(): number {
        let result = 0;
        for (const buttonGroup of this.buttonGroups) {
            for (const button of buttonGroup.buttons) {
                if (button.visible) {
                    result++;
                    break;
                }
            }
        }
        return result;
    }

    get buttonGroups(): ButtonGroup[] {
        return this._buttonGroups;
    }

    set buttonGroups(value: ButtonGroup[]) {
        this._buttonGroups = value;
    }

    get search(): boolean {
        return this._search;
    }

    set search(value: boolean) {
        this._search = value;
    }

    get handler(): IListHandler {
        return this._handler;
    }

    set handler(value: IListHandler) {
        this._handler = value;
    }

    get buttonHandler(): IButtonHandler {
        return this._buttonHandler;
    }

    set buttonHandler(value: IButtonHandler) {
        this._buttonHandler = value;
    }

    get icon(): string {
        return this._icon;
    }

    set icon(value: string) {
        this._icon = value;
    }

    get color(): string {
        return this._color;
    }

    set color(value: string) {
        this._color = value;
    }

    get form(): string {
        return this._form;
    }

    set form(value: string) {
        this._form = value;
    }

    get formHandler(): string {
        return this._formHandler;
    }

    set formHandler(value: string) {
        this._formHandler = value;
    }

    get page(): string {
        return this._page;
    }

    set page(value: string) {
        this._page = value;
    }

    get mockData(): any {
        return this._mockData;
    }

    set mockData(value: any) {
        this._mockData = value;
    }

    get url(): string {
        return this._url;
    }

    set url(value: string) {
        this._url = value;
    }

    get limit(): number {
        return this._limit;
    }

    set limit(value: number) {
        this._limit = value;
    }

    get searchRequired(): boolean {
        return this._searchRequired;
    }

    get searchRequest(): boolean {
        return this._searchRequest;
    }

    get searchText(): string {
        return this._searchText;
    }

    get searchLabel(): string {
        return this._searchLabel;
    }

    get searchInputLabel(): string {
        return this._searchInputLabel;
    }

    set searchLabel(value: string) {
        this._searchLabel = value;
    }

    set searchInputLabel(value: string) {
        this._searchInputLabel = value;
    }

    set searchText(value: string) {
        this._searchText = value;
    }

    public fromJson(modelElement) {
        super.fromJson(modelElement);
        if (modelElement["search"] != null) {
            this.search = modelElement["search"];
        }
        if (modelElement["searchRequired"] != null) {
            this._searchRequired = modelElement["searchRequired"];
        }
        if (modelElement["searchRequest"] != null) {
            this._searchRequest = modelElement["searchRequest"];
        }
        if (modelElement["limit"] != null) {
            this.limit = modelElement["limit"];
        }
        // verify valid search combinations
        if (!this.search && this.searchRequired) {
            console.log("Configuration Error: search=false requires searchRequired=false");
            this._searchRequired = false;
        }
        if (this.searchRequired && !this.searchRequest) {
            console.log("Configuration Error: searchRequired=true requires searchRequest=true");
            this._searchRequest = true;
        }
        // other model attributes
        if (modelElement["color"] != null) {
            this.color = modelElement["color"];
        }
        if (modelElement["form"] != null) {
            this.form = modelElement["form"]["form"];
            this.formHandler = modelElement["form"]["handler"];
        }
        if (modelElement["page"] != null) {
            this.page = modelElement["page"];
        }
        if (modelElement["icon"] != null) {
            this.icon = modelElement["icon"];
        }
        if (modelElement["data"] != null) {
            this.mockData = modelElement["data"];
        }
        if (modelElement["name"] != null) {
            this.name = this.translationService.getText(modelElement["name"]);
        }
        if (modelElement["url"] != null) {
            const urlString: string = modelElement["url"];
            this.url = KeyUtility.translateUrl(urlString, null, false, this);
        }
        // override from PageElement
        if (modelElement["width"] != null) {
            this.width = modelElement["width"];
        } else {
            this.width = 2; // special default for list
        }
        // delay for search field
        const debounceTimeValue: number = this.searchRequest ? 300 : 30;
        this._searchTextChanged.pipe(
            debounceTime(debounceTimeValue)) // wait after the last event before emitting last event
            .subscribe(_searchText => {
                this._searchText = _searchText;
                this.filter();
            });
    }
}
