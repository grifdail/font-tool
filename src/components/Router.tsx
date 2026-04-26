import { Route, Switch } from "wouter";
import { Home } from "./Home";
import { AboutPage } from "./AboutPage";
import { SettingsPage } from "./SettingsPage";

export function Router() {
    return <>
        <Switch>
            {/* Default route in a switch */}
            <Route path='/edit' component={Home}></Route>
            <Route path='/settings' component={SettingsPage}></Route>
            <Route component={AboutPage}></Route>
        </Switch>
    </>
}