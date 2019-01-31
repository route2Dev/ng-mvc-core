import { MyDynamicView } from './my-dynamic.view';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-dynamic',
  templateUrl: './my-dynamic.component.html',
  styleUrls: ['./my-dynamic.component.css']
})
export class MyDynamicComponent implements OnInit {

  viewTemplate = '<p> Dynamic Template Message: {{message}}<p>';
  viewClass = MyDynamicView;
  viewId = 'MyDynamicView';

  constructor() { }

  ngOnInit() {
  }

}
