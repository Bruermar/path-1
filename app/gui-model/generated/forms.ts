import * as path from './../../path-framework/path';
import {FormField} from "../../path-framework/form/field/form-field";
import {AutoCompleteField} from "../../path-framework/form/field/auto-complete/auto-complete.component";
import {RadioGroupField} from "../../path-framework/form/field/radio/radio-group.component";
import {ProgressBarField} from "../../path-framework/form/field/progress-bar/progress-bar.component";
import {TextField} from "../../path-framework/form/field/text/text-field.component";

// TODO in future versions these classes will be generated from gui model

export class ProjectForm implements path.IFormBean {

    private _project:path.FormField;
    private _caseKey:path.AutoCompleteField;
    private _startDate:path.FormField;
    private _endDate:path.FormField;
    private _customerKey:path.AutoCompleteField;
    private _serviceProviderKey:path.AutoCompleteField;
    private _customerProjectLeaderKey:path.AutoCompleteField;
    private _serviceProviderProjectLeaderKey:path.AutoCompleteField;
    private _industrySegment:path.AutoCompleteField;
    private _benchmarking:path.RadioGroupField;
    private _monitoring:path.RadioGroupField;
    private _comment:path.FormField;

    get project():FormField {
        return this._project;
    }

    set project(value:FormField) {
        this._project = value;
    }

    get caseKey():AutoCompleteField {
        return this._caseKey;
    }

    set caseKey(value:AutoCompleteField) {
        this._caseKey = value;
    }

    get startDate():FormField {
        return this._startDate;
    }

    set startDate(value:FormField) {
        this._startDate = value;
    }

    get endDate():FormField {
        return this._endDate;
    }

    set endDate(value:FormField) {
        this._endDate = value;
    }

    get customerKey():AutoCompleteField {
        return this._customerKey;
    }

    set customerKey(value:AutoCompleteField) {
        this._customerKey = value;
    }

    get serviceProviderKey():AutoCompleteField {
        return this._serviceProviderKey;
    }

    set serviceProviderKey(value:AutoCompleteField) {
        this._serviceProviderKey = value;
    }

    get customerProjectLeaderKey():AutoCompleteField {
        return this._customerProjectLeaderKey;
    }

    set customerProjectLeaderKey(value:AutoCompleteField) {
        this._customerProjectLeaderKey = value;
    }

    get serviceProviderProjectLeaderKey():AutoCompleteField {
        return this._serviceProviderProjectLeaderKey;
    }

    set serviceProviderProjectLeaderKey(value:AutoCompleteField) {
        this._serviceProviderProjectLeaderKey = value;
    }

    get industrySegment():AutoCompleteField {
        return this._industrySegment;
    }

    set industrySegment(value:AutoCompleteField) {
        this._industrySegment = value;
    }

    get benchmarking():RadioGroupField {
        return this._benchmarking;
    }

    set benchmarking(value:RadioGroupField) {
        this._benchmarking = value;
    }

    get monitoring():RadioGroupField {
        return this._monitoring;
    }

    set monitoring(value:RadioGroupField) {
        this._monitoring = value;
    }

    get comment():FormField {
        return this._comment;
    }

    set comment(value:FormField) {
        this._comment = value;
    }
}

export class QuestionForm implements path.IFormBean {
    private _question:path.RadioGroupField;
    private _progress:path.ProgressBarField;
    private _formula:path.TextField;
    private _input1:path.TextField;
    private _unit1:path.TextField;
    private _input2:path.TextField;
    private _unit2:path.TextField;
    private _comment:path.TextField;

    get question():RadioGroupField {
        return this._question;
    }

    set question(value:RadioGroupField) {
        this._question = value;
    }

    get progress():ProgressBarField {
        return this._progress;
    }

    set progress(value:ProgressBarField) {
        this._progress = value;
    }

    get formula():TextField {
        return this._formula;
    }

    set formula(value:TextField) {
        this._formula = value;
    }

    get input1():TextField {
        return this._input1;
    }

    set input1(value:TextField) {
        this._input1 = value;
    }

    get unit1():TextField {
        return this._unit1;
    }

    set unit1(value:TextField) {
        this._unit1 = value;
    }

    get input2():TextField {
        return this._input2;
    }

    set input2(value:TextField) {
        this._input2 = value;
    }

    get unit2():TextField {
        return this._unit2;
    }

    set unit2(value:TextField) {
        this._unit2 = value;
    }

    get comment():TextField {
        return this._comment;
    }

    set comment(value:TextField) {
        this._comment = value;
    }
}

export class CompanyForm implements path.IFormBean {

    private _companyName:path.TextField;
    private _street:path.TextField;
    private _postalCode:path.TextField;
    private _city:path.TextField;
    private _comments:path.TextField;

    get companyName():path.TextField {
        return this._companyName;
    }

    set companyName(value:path.TextField) {
        this._companyName = value;
    }

    get street():path.TextField {
        return this._street;
    }

    set street(value:path.TextField) {
        this._street = value;
    }

    get postalCode():path.TextField {
        return this._postalCode;
    }

    set postalCode(value:path.TextField) {
        this._postalCode = value;
    }

    get city():path.TextField {
        return this._city;
    }

    set city(value:path.TextField) {
        this._city = value;
    }

    get comments():path.TextField {
        return this._comments;
    }

    set comments(value:path.TextField) {
        this._comments = value;
    }
}