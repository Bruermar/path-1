import * as path from './../../path';
import {IPageElement} from "../../pathinterface";

export class PageElement implements IPageElement {
    private _app:path.IPathApp;
    private _id:string;
    private _name:string;
    private _type:string;

    constructor(app:path.IPathApp) {
        this._app = app;
    }

    get app():path.IPathApp {
        return this._app;
    }

    get name():string {
        return this._name;
    }

    set name(value:string) {
        this._name = value;
    }

    get type():string {
        return this._type;
    }

    set type(value:string) {
        this._type = value;
    }

    get id():string {
        return this._id;
    }

    set id(value:string) {
        this._id = value;
    }
}