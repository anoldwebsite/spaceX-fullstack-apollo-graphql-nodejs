import styled from "@emotion/styled";
import { css } from "emotion";
import React from "react";
import { Link } from "@reach/router";
import { unit } from "../styles";

import galaxy from "../assets/images/galaxy.jpg";
import iss from "../assets/images/iss.jpg";
import moon from "../assets/images/moon.jpg";
import * as LaunchTileTypes from "../pages/__generated__/LaunchTile";

const backgrounds = [galaxy, iss, moon];
export function getBackgroundImage(id: string) {
  return `url(${backgrounds[Number(id) % backgrounds.length]})`;
}

interface LaunchTileProps {
  launch: LaunchTileTypes.LaunchTile;
}

const LaunchTile: React.FC<LaunchTileProps> = ({ launch }) => {
  const { id, mission, rocket } = launch;
  return (
    <StyledLink
      to={`/launch/${id}`}
      style={{
        backgroundImage: getBackgroundImage(id),
      }}
    >
      <h3>{mission ? mission.name : ""}</h3>
      <h5>{rocket && rocket.name}</h5>
    </StyledLink>
  );
};

export default LaunchTile;

//Styled components used in this file are given below
export const cardClassName = css({
  padding: `${unit * 4}px ${unit * 5}px`,
  borderRadius: 7,
  color: "white",
  backgroundSize: "cover",
  backgroundPosition: "center",
});

const padding = unit * 2;
const StyledLink = styled(Link)(cardClassName, {
  display: "block",
  height: 193,
  marginTop: padding,
  textDecoration: "none",
  ":not(:last-child": {
    marginBottom: padding * 2,
  },
});
