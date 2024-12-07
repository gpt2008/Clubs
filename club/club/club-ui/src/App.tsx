import React, { createRef } from "react";

import { LoadingOutlined } from "@ant-design/icons";
import "./App.scss";
import EventHub, { Event } from "./utils/eventHub";

interface IState {
  showLoadingMask?: boolean;
}

export default class App extends React.Component<{}, IState> {
  public state: IState = { showLoadingMask: false };

  private restCalls: number = 0;
  private timerFadeInEffect?: any;
  private timerFadeOutEffect?: any;
  private loadingMaskRef = createRef<HTMLDivElement>();

  public componentDidMount() {
    EventHub.on(Event.LOADING_ON, () => {
      this.maskOn();
    });

    EventHub.on(Event.LOADING_OFF, () => {
      this.maskOff();
    });
  }

  public render() {
    return (
      <>
        {this.state.showLoadingMask && (
          <div ref={this.loadingMaskRef} className="app-loading-mask">
            <LoadingOutlined style={{ fontSize: 48 }} spin />
          </div>
        )}
      </>
    );
  }

  private maskOn = () => {
    this.restCalls++;

    if (this.restCalls === 1) {
      clearTimeout(this.timerFadeOutEffect);
      this.setState({ showLoadingMask: true }, () => {
        this.timerFadeInEffect = setTimeout(
          () => (this.loadingMaskRef.current!.style.opacity = "1"),
          50
        );
      });
    }
  };

  private maskOff = () => {
    this.restCalls--;

    if (this.restCalls < 0) {
      this.restCalls = 0;
    }

    if (this.restCalls === 0 && this.loadingMaskRef.current) {
      clearTimeout(this.timerFadeInEffect);
      this.loadingMaskRef.current.style.opacity = "0";
      clearTimeout(this.timerFadeOutEffect);
      this.timerFadeOutEffect = setTimeout(
        () => this.setState({ showLoadingMask: false }),
        500
      );
    }
  };
}
/*
class AppRoutes extends React.Component<RouteComponentProps> {
  public componentDidMount() {
    setRestHistory(this.props.history);
  }

  public render() {
    return (
      <></>
      /*<Switch>
        <Route path="/app" component={MainLayout} />
        <Route path="/login" component={LoginLayout} />
        {<Route path='/welcome-doc/:token' component={Welcome} />}
        <Route path="/oops" component={TokenNoValido} />
        <Redirect to="login" />
      </Switch>
    );
  }
}

const AppRoutesWithRouter = withRouter(AppRoutes);*/
