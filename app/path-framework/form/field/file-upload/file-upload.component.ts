import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";
import {ValueField} from "../value-field";
import {HttpClient, HttpEvent, HttpEventType, HttpParams, HttpRequest, HttpResponse} from "@angular/common/http";
import {PathService} from "../../../service/path.service";
import {Observable} from "rxjs";
import {Key} from "../../../page/element/page-element";

@Component({
    selector: "path-file-upload",
    templateUrl: "file-upload.component.html"
})
export class FileUploadComponent {
    @Input("field")
    @Output("field")
    field: FileUploadField;

    constructor(private http: HttpClient) {
    }

    // At the drag drop area
    // (drop)="onDropFile($event)"
    onDropFile(event: DragEvent) {
        event.preventDefault();
        this.uploadFile(event.dataTransfer.files);
    }

    // At the drag drop area
    // (dragover)="onDragOverFile($event)"
    onDragOverFile(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    // At the file input element
    // (change)="selectFile($event)"
    selectFile(event) {
        this.uploadFile(event.target.files);
    }

    uploadFile(files: FileList) {
        if (files.length === 0) {
            console.log("No file selected!");
            return;

        }
        const file: File = files[0];

        this.doUpload(this.field.getForm().getApp().getBackendUrl() + this.field.url, file)
            .subscribe(
                event => {
                    if (event.type === HttpEventType.UploadProgress) {
                        const percentDone = Math.round(100 * event.loaded / event.total);
                        console.log(`File is ${percentDone}% loaded.`);
                    } else if (event instanceof HttpResponse) {
                        console.log("File is completely loaded!");
                    }
                },
                (err) => {
                    console.log("Upload Error:", err);
                }, () => {
                    const newFile = new PathFile();
                    newFile.name = file.name;
                    newFile.key = new Key("TBD", "TBD");
                    newFile.active = true;
                    this.field.files.push(newFile);
                    console.log("Upload done");
                }
            );
    }

    // file from event.target.files[0]
    private doUpload(url: string, file: File): Observable<HttpEvent<any>> {

        const formData = new FormData();
        formData.append("upload", file);

        const params = new HttpParams();

        const options = {
            params: params,
            reportProgress: true,
        };

        const req = new HttpRequest("POST", url, formData, options);
        return this.http.request(req);
    }

}

export class FileUploadField extends ValueField<string[]> {

    private _url: string;
    private _multiple: boolean;
    private _files: PathFile[] = [];

    get url(): string {
        return this._url;
    }

    set url(value: string) {
        this._url = value;
    }

    get multiple(): boolean {
        return this._multiple;
    }

    set multiple(value: boolean) {
        this._multiple = value;
    }

    get files(): PathFile[] {
        return this._files;
    }

    set files(value: PathFile[]) {
        this._files = value;
    }

    public remove(key: Key): void {
        for (const file of this.files) {
            if (file.key.equals(key)) {
                file.active = false;
                break;
            }
        }
    }

    public fromJson(modelFormField) {
        super.fromJson(modelFormField);
        this.type = "fileUpload";
        if (modelFormField["url"]) {
            this.url = modelFormField["url"];
        }
        if (modelFormField["multiple"]) {
            this.multiple = modelFormField["multiple"];
        }
    }

}

export class PathFile {
    private _active: boolean;
    private _name: string;
    private _key: Key;

    get active(): boolean {
        return this._active;
    }

    set active(value: boolean) {
        this._active = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get key(): Key {
        return this._key;
    }

    set key(value: Key) {
        this._key = value;
    }
}
