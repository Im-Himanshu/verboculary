import {Injectable} from '@angular/core';
import html2canvas from 'html2canvas';


@Injectable()
export class Html2canvasService {
    constructor() {

    }

    public html2canvas(ele) {

        if (!ele) {
            return;
        }
        console.log("CALLED");
        const option = {allowTaint: true, useCORS: true};
        return html2canvas(ele, option).then((canvas) => {
            if (canvas) {
                return canvas.toDataURL('image/png');
            }
            return null;
        }).catch((res) => {
            console.log(res);
            return res;
        });
    }
}