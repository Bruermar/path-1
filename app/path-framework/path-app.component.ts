import * as path from './path';
import * as autocomplete from './form/field/auto-complete/auto-complete.component';

export abstract class PathAppComponent implements path.IPathApp {

    private _pageStack:path.Page[] = [];
    private _formStack:path.Form[] = [];

    protected abstract getGuiModel();

    protected abstract getBeans();

    protected abstract getHandlers();

    public getPageStack():path.Page[] {
        return this._pageStack;
    }

    public getFormStack():path.Form[] {
        return this._formStack;
    }
    
    public yesNo(text:string, yesHandler : () => void, noHandler : () => void) {
        let form:path.Form = new path.Form();
        let message:path.TextField = new path.TextField(this);
        message.type = "text";
        message.visible = true;
        message.value = text;
        form.fields.push(message);
        let okButton:path.OkButton = new path.OkButton(this);
        okButton.type = "okButton";
        okButton.name = "Ok";
        let handler : path.IButtonHandler = {
            doClick(button:path.IButton) {
                yesHandler();
            }
        }
        okButton.handler = handler;
        form.fields.push(okButton);

        let cancelButton:path.CancelButton = new path.CancelButton(this);
        cancelButton.type = "cancelButton";
        cancelButton.name = "Cancel";
        form.fields.push(cancelButton);


        this.getFormStack().push(form);
    }

    public closeForm() {
        this._formStack.pop();
    }

    // TODO remove
    public doCancel() {
        this._formStack = [];
    }

    public onKey(event) {
        if (event.keyCode == 27) {
            this.doCancel();
        }
    }

    public getCurrentPage() {
        return this._pageStack[this._pageStack.length - 1];
    }

    public navigateBack() {
        this._pageStack.pop();
    }

    public goToPage(pageNumber:number) {
        for (let k = this.getPageStack().length - 1; k > pageNumber; k--) {
            console.log("back");
            this.navigateBack();
        }
    }

    public setCurrentPage(pageId:string, parentPageElement:path.PageElement) {
        let page:path.Page = null;

        for (var modelPage of this.getGuiModel().application.pageList) {
            if (modelPage.id == pageId) {
                page = new path.Page();
                page.id = pageId;
                page.parentPageElement = parentPageElement;
                page.title = modelPage.title;
                for (var modelElement of modelPage.elementList) {
                    // element
                    let element:path.PageElement = null;
                    switch (modelElement.type) {
                        case "button":
                            element = this.createButton(modelElement);
                            break;
                        case "backbutton":
                            let backButton:path.BackButton = new path.BackButton(this);
                            backButton.icon = modelElement["icon"];
                            backButton.color = modelElement["color"];
                            element = backButton;
                            break;
                        case "list":
                            let dynamicList:path.List = new path.List(this);
                            dynamicList.search = modelElement["search"];
                            for (var listElement of modelElement["data"]) {
                                let button:path.Button = this.createButton(modelElement);
                                button.name = listElement.name;
                                button.color = listElement["color"] != null ? listElement["color"] : button.color;
                                if (modelElement["handler"] != null) {
                                    button.handler = new (this.getHandlers()[modelElement["handler"]]);
                                }
                                dynamicList.content.push(button);
                            }
                            element = dynamicList;
                            break;
                    }
                    element.name = modelElement["name"];
                    element.type = modelElement.type;
                    page.content.push(element);
                }
            }
        }

        if (page == null && pageId != null) {
            alert("Missing page: " + pageId);
        }
        this._pageStack.push(page);
    }

    private createButton(modelElement) : path.Button {
        if (modelElement["form"] != null) {
            let formButton:path.FormButton = new path.FormButton(this);
            formButton.icon = modelElement["icon"];
            formButton.color = modelElement["color"];
            formButton.form = modelElement["form"]["form"];
            formButton.mode = modelElement["form"]["mode"];
            formButton.formHandler = modelElement["form"]["handler"];
            return formButton;
        } else {
            let pageButton:path.PageButton = new path.PageButton(this);
            pageButton.icon = modelElement["icon"];
            pageButton.color = modelElement["color"];
            pageButton.page = modelElement["page"];
            return pageButton;
        }
    }

    public setCurrentForm(formId:string, mode:string, handler:string) {
        let forms:path.Form[] = [];
        let form:path.Form = null;
        for (var modelForm of this.getGuiModel().application.formList) {
            if (modelForm.id === formId) {
                // create form
                form = new path.Form();
                form.title = modelForm.title;
                for (var modelFormField of modelForm.formFieldList) {
                    // create form fields
                    let formField:path.FormField = null;
                    switch (modelFormField.type) {
                        case "text":
                        {
                            formField = new path.TextField(this);
                            break;
                        }
                        case "okButton":
                        {
                            formField = new path.OkButton(this);
                            break;
                        }
                        case "cancelButton":
                        {
                            formField = new path.CancelButton(this);
                            break;
                        }
                        case "autocomplete":
                        {
                            let autoCompleteFormField = new autocomplete.AutoCompleteField(this);
                            autoCompleteFormField.data = modelFormField["data"];
                            autoCompleteFormField.wordSearchEnabled = modelFormField["wordSearchEnabled"];
                            formField = autoCompleteFormField;
                            break;
                        }
                        case "radiogroup":
                        {
                            let radioGroupFormField = new path.RadioGroup(this);
                            for (var radioModel of modelFormField["radios"]) {
                                let radio = new path.Radio(this);
                                radio.name = radioModel.name;
                                radioGroupFormField.radios.push(radio);
                            }
                            formField = radioGroupFormField;
                            break;
                        }
                        default:
                        {
                            formField = new path.FormField(this);
                        }
                    }
                    // general values
                    formField.visible = true;
                    if (modelFormField["visible"] != null) {
                        formField.visible = modelFormField["visible"];
                    }
                    formField.id = modelFormField["id"];
                    formField.name = modelFormField.name;
                    formField.type = modelFormField.type;
                    formField.height = modelFormField["height"];
                    if (modelFormField["actions"] != null) {
                        for (var action of modelFormField["actions"]) {
                            let actionObject:path.Action = new path.Action();
                            actionObject.name = action.name;
                            actionObject.type = action.type;
                            formField.actions.push(actionObject);
                        }
                    }
                    form.fields.push(formField);
                }
                // get handler and execute load
                let handlerName = handler;
                if (handlerName == null) {
                    handlerName = formId + 'Handler';
                }
                if (this.getBeans()[formId] != null && this.getHandlers()[handlerName] != null) {
                    let formBean:path.IForm = new (this.getBeans()[formId]);
                    let formHandler:path.IFormHandler = new (this.getHandlers()[handlerName]);
                    for (let a = 0; a < form.fields.length; a++) {
                        if (form.fields[a].id != null) {
                            formBean[form.fields[a].id] = form.fields[a];
                        }
                    }
                    formHandler.doLoad(formBean);
                }

                forms.push(form)
            }
        }
        if (form == null && formId != null) {
            alert("Missing form: " + formId);
        }
        this._formStack = forms;
    }

}