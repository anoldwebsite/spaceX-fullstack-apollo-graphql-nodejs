import React, { Fragment } from "react";
import styled from "@emotion/styled";
import { unit, colors } from "../styles";

export default function PageContainer(props: any) {
  return (
    <Fragment>
      <Bar />
      <Container>{props.children}</Container>
    </Fragment>
  );
}

const Bar = styled("div")({
  flexShrink: 0,
  height: 12,
  backgroundColor: colors.primary,
});

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  width: "100%",
  maxWidth: 600,
  margin: "0 auto",
  padding: unit * 3,
  paddingBottom: unit * 5,
});
