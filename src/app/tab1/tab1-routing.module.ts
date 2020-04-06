import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Tab1Page } from './tab1.page';
import { ViewPropertiesComponent } from '../view-properties/view-properties.component';
import { AddPropertyComponent } from '../add-property/add-property.component';
import { PropertyComponent } from '../property/property.component';

const routes: Routes = [
    {
        path: '',
        component: Tab1Page,
        children: [
            {
                path: 'viewAll',
                component: ViewPropertiesComponent
            },
            {
                path: 'property/:id',
                component: PropertyComponent
            },
            {
                path: 'add',
                component: AddPropertyComponent
            },
            {
                path: 'edit/:id',
                component: AddPropertyComponent
            },
            {
                path: '',
                redirectTo: '/tabs/tab1/viewAll',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class Tab1RoutingModule { }
