import "./index.scss";
import * as React from "react";

interface Common {
  text?: string;
  secondText?: string;
  important?: string;
  mail?: string;
  style?: React.CSSProperties;
  url?: string;
  href?: string;
  lastText?: string;
  thirdText?: string;
  secondImportant?: string;
  id?: string;
}

const Title = (props: Common) => {
  return (
    <div style={props.style} className="first_title">
      {props.text}
    </div>
  );
};

const UpdateTime = (props: Common) => {
  return (
    <div style={props.style} className="update_time">
      {props.text}
    </div>
  );
};

const Content = (props: Common) => {
  return (
    <div style={props.style} className="content">
      <span>{props.text}</span>
      <a
        target="_blank"
        href={`mailto:${props.mail}`}
        className="url"
        rel="noreferrer"
      >
        {props.url}
      </a>
      <span>{props.secondText}</span>
      <span style={{ fontFamily: "MessinaSans-SemiBold" }}>
        {props.important}
      </span>
      <span>{props.thirdText}</span>
      <a
        target="_blank"
        href={`${props.href}`}
        className="url"
        rel="noreferrer"
      >
        {props.href}
      </a>
      <span style={{ fontFamily: "MessinaSans-SemiBold" }}>
        {props.secondImportant}
      </span>
      <span>{props.lastText}</span>
    </div>
  );
};

const SecondTitle = (props: Common) => {
  return (
    <div style={props.style} className="second_title">
      {props.text}
    </div>
  );
};

const ThirdTitle = (props: Common) => {
  return (
    <div style={props.style} id={props.id} className="third_title">
      {props.text}
    </div>
  );
};

const ContentWithPoint = (props: Common) => {
  return (
    <div style={props.style} className="content_with_point">
      <span className="point">·</span>
      <div>
        <span className="important">{props.important}</span>
        {props.text?.replace(props.important ?? "", "")}
        <span>
          <a className="url" href={props.url}>
            {props.url}
          </a>
        </span>
      </div>
    </div>
  );
};

const Contry = (props: Common) => (
  <div
    style={{
      display: "flex",
      marginBottom: 5,
      width: "100%",
      color: "#1b2022",
    }}
  >
    <div
      style={{
        width: 8,
        height: 8,
        marginTop: 4,
        marginRight: 5,
        backgroundColor: "#1b2022",
        borderRadius: 4,
      }}
    />
    <div>{props.text}</div>
  </div>
);

export {
  Title,
  UpdateTime,
  Content,
  SecondTitle,
  ContentWithPoint,
  ThirdTitle,
  Contry,
};
