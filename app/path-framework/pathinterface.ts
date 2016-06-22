export interface IPathApp {
    setCurrentForm(formId:string, key:number, handler:string);
    setCurrentPage(pageId:string, parentPageElement:IPageElement);
    navigateBack();
    yesNo(text:string, yesHandler : () => void, noHandler : () => void);
    closeCurrentForm();
    getBackendUrl():string;
    refreshCurrentPage();
}

export interface IPageElement {
}

export interface IFormField {
    getForm():IForm;
}

export interface IForm {
    getApp():IPathApp;
    close(save:boolean);
}

export interface IFormHandler {
    doLoad(form:IFormBean);
    doSave(form:IFormBean);
    doValidate(form:IFormBean);
}

export interface IList {
    addButton(id:number,name:string,handler:IButtonHandler,details:string[]):IButton;
    getContent():IButton[];
}

export interface IListHandler {
    doLoad(list:IList);
}

export interface IButtonHandler {
    doClick(button:IButton);
}

export interface IActionHandler {
    doClick(field:IFormField, action:IAction);
}

export interface IAction {
}

export interface IFormBean {
}

export interface IButton {
    setColor(color:string);
    getColor() : string;
    setIcon(icon:string);
    setForm(form:string);
    setKey(key:number);
    setFormHandler(formHandler:string);
    setPage(page:string);
    getName() : string;
    getApp():IPathApp;
}