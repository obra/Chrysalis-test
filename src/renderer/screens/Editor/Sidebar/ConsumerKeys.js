// -*- mode: js-jsx -*-
/* Chrysalis -- Kaleidoscope Command Center
 * Copyright (C) 2020  Keyboardio, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from "react";
import i18n from "i18next";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import withStyles from "@mui/styles/withStyles";

import Collapsible from "../components/Collapsible";
import KeyButton from "../components/KeyButton";
import { KeymapDB } from "../../../../api/keymap";

const db = new KeymapDB();

const styles = theme => ({
  card: {
    marginBottom: theme.spacing(1)
  }
});

const VolumeKeys = withStyles(styles)(props => {
  const keys = [
    db.lookup(18658), // mute
    db.lookup(18665), // up
    db.lookup(18666) // down
  ];

  const keyButtons = keys.map((button, index) => {
    return (
      <KeyButton
        key={`consumer-volume-${index}`}
        onKeyChange={props.onKeyChange}
        keyObj={button}
        noHint
      />
    );
  });

  return (
    <Card variant="outlined" className={props.classes.card}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {i18n.t("editor.sidebar.consumer.volume")}
        </Typography>

        {keyButtons}
      </CardContent>
    </Card>
  );
});

const MediaKeys = withStyles(styles)(props => {
  const keys = [
    db.lookup(18614), // prev
    db.lookup(18613), // next track
    db.lookup(18615), // stop
    db.lookup(18637) // play/pause
  ];

  const keyButtons = keys.map((button, index) => {
    return (
      <KeyButton
        key={`consumer-media-${index}`}
        onKeyChange={props.onKeyChange}
        keyObj={button}
        noHint
      />
    );
  });

  return (
    <Card variant="outlined" className={props.classes.card}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {i18n.t("editor.sidebar.consumer.media")}
        </Typography>

        {keyButtons}
      </CardContent>
    </Card>
  );
});

const BrightnessKeys = withStyles(styles)(props => {
  const keys = [
    db.lookup(18543), // up
    db.lookup(18544) // down
  ];

  const keyButtons = keys.map((button, index) => {
    return (
      <KeyButton
        key={`consumer-brightness-${index}`}
        onKeyChange={props.onKeyChange}
        keyObj={button}
        noHint
      />
    );
  });

  return (
    <Card variant="outlined" className={props.classes.card}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {i18n.t("editor.sidebar.consumer.brightness")}
        </Typography>

        {keyButtons}
      </CardContent>
    </Card>
  );
});

class ConsumerKeysBase extends React.Component {
  render() {
    const { keymap, selectedKey, layer, onKeyChange } = this.props;
    const key = keymap.custom[layer][selectedKey];

    const subWidgets = [VolumeKeys, MediaKeys, BrightnessKeys];
    const widgets = subWidgets.map((Widget, index) => {
      return (
        <Widget key={`consumer-group-${index}`} onKeyChange={onKeyChange} />
      );
    });

    return (
      <Collapsible
        expanded={db.isInCategory(key.code, "consumer")}
        title={i18n.t("editor.sidebar.consumer.title")}
        help={i18n.t("editor.sidebar.consumer.help")}
      >
        {widgets}
      </Collapsible>
    );
  }
}
const ConsumerKeys = withStyles(styles, { withTheme: true })(ConsumerKeysBase);

export { ConsumerKeys as default };
