import { Route, Switch } from "wouter";
import { Home } from "./Home";
import { AboutPage } from "./AboutPage";

export function Router() {
    return <>
        <Switch>
            {/* Default route in a switch */}
            <Route path='/edit' component={Home}></Route>
            <Route component={AboutPage}></Route>
        </Switch>
    </>
}