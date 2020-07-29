import { Injectable, RendererFactory2, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Storage } from '@ionic/storage'

@Injectable({
  providedIn: 'root'
})
export class ThemeChangeService {
  renderer : Renderer2;
  crntClass : string;
  mode: string;
  checked: boolean = true;
  value: string = 'Light Theme';
  constructor(private renderedFactory : RendererFactory2, @Inject(DOCUMENT) private document : Document, private storage: Storage) {
    this.renderer = this.renderedFactory.createRenderer(null,null);
    this.setThemeInitialValue();
    this.getThemeValue().then(mode => {
      this.mode = mode;
      this.setMode(this.mode);
    })
  }

  setThemeInitialValue(){
    this.getThemeValue().then(mode => {
      if(!mode){
        this.setThemeValue('lightTheme');
      }
    })
  }

  getThemeValue(){
    return this.storage.get("mode");
  }

  setThemeValue(mode){

    this.storage.set("mode",mode);
  }

  toggleMode(){
    if(this.mode == 'lightTheme'){
      this.setMode('darkTheme');
    }
    else{
      this.setMode('lightTheme');
    }
  }

  setMode(modeValue: string){
    if(modeValue == 'darkTheme'){
      this.renderer.removeClass(this.document.body,"lightTheme");
      this.renderer.addClass(this.document.body, "darkTheme");
      this.mode = "darkTheme";
      this.setThemeValue('darkTheme');
      this.value = 'Dark Theme'
      this.checked = false;
    }
    else{
      this.renderer.removeClass(this.document.body,"darkTheme");
      this.renderer.addClass(this.document.body, "lightTheme");
      this.mode = "lightTheme";
      this.value = 'Light Theme';
      this.setThemeValue('lightTheme');
      this.checked = true;
    }
  }


  changeTheme(themeName : string){
    if(this.crntClass) this.renderer.removeClass(this.document.body, this.crntClass);
    if(themeName) this.renderer.addClass(this.document.body, themeName); // this themeName should exsist in the app.component.scss under :root{}
    this.crntClass = themeName;
  }

}
