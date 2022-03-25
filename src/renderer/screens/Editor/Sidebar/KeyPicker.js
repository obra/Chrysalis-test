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

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import withStyles from "@mui/styles/withStyles";

import Keyboard104 from "../Keyboard104";
import Collapsible from "../components/Collapsible";
import { KeymapDB } from "../../../../api/keymap";
import {
  addModifier,
  removeModifier
} from "../../../../api/keymap/db/modifiers";
import { GuiLabel } from "../../../../api/keymap/db/base/gui";
import LayoutSelect from "./KeyPicker/LayoutSelect";

const db = new KeymapDB();

const styles = theme => ({
  mods: {
    marginTop: theme.spacing(1)
  },
  layout: {
    marginTop: theme.spacing(2)
  },
  modContainer: {
    margin: `${theme.spacing(2)} 0`
  },
  keyPickButton: {
    marginBottom: theme.spacing(2)
  }
});

class KeyPickerBase extends React.Component {
  state = {
    pickerOpen: false
  };

  isStandardKey = props => {
    const { selectedKey, keymap, layer } = props;
    const key = keymap.custom[layer][selectedKey];
    const code = key.baseCode || key.code;

    return code >= 4 && code <= 255 && !db.isInCategory(key.code, "dualuse");
  };

  isOSM = () => {
    const { selectedKey, keymap, layer } = this.props;
    const key = keymap.custom[layer][selectedKey];

    return (
      db.isInCategory(key.code, "modifier") &&
      db.isInCategory(key.code, "oneshot")
    );
  };

  isDualUse = () => {
    const { selectedKey, keymap, layer } = this.props;
    const key = keymap.custom[layer][selectedKey];

    return db.isInCategory(key.code, "dualuse");
  };

  openPicker = () => {
    this.setState({ pickerOpen: true });
  };

  closePicker = () => {
    this.setState({ pickerOpen: false });
  };

  onKeyChange = keyCode => {
    const { selectedKey, keymap, layer } = this.props;
    const key = keymap.custom[layer][selectedKey];
    let offset = 0;
    if (key.baseCode) {
      offset = key.code - key.baseCode;
    }

    this.props.onKeyChange(parseInt(keyCode) + offset);
    this.closePicker();
  };

  toggleModifier = mod => event => {
    const { selectedKey, keymap, layer } = this.props;
    const key = keymap.custom[layer][selectedKey].code;

    if (event.target.checked) {
      this.props.onKeyChange(addModifier(key, mod));
    } else {
      this.props.onKeyChange(removeModifier(key, mod));
    }
  };

  toggleOneShot = event => {
    const { selectedKey, keymap, layer } = this.props;
    const key = keymap.custom[layer][selectedKey];

    if (event.target.checked) {
      this.props.onKeyChange(key.code - 224 + 49153);
    } else {
      this.props.onKeyChange(key.code - key.rangeStart + 224);
    }
  };

  makeSwitch = mod => {
    const { selectedKey, keymap, layer } = this.props;
    const key = keymap.custom[layer][selectedKey].code;

    return (
      <Switch
        checked={db.isInCategory(key, mod)}
        color="primary"
        onChange={this.toggleModifier(mod)}
      />
    );
  };

  render() {
    const { classes, keymap, selectedKey, layer } = this.props;
    const key = keymap.custom[layer][selectedKey];

    let oneShot;
    if (db.isInCategory(key.baseCode || key.code, "modifier")) {
      const osmControl = (
        <Switch
          checked={db.isInCategory(key, "oneshot")}
          color="primary"
          onChange={this.toggleOneShot}
        />
      );

      oneShot = (
        <FormControl
          component="fieldset"
          className={classes.mods}
          disabled={
            !db.isInCategory(key.code, "modifier") ||
            db.isInCategory(key.code, "dualuse")
          }
        >
          <FormGroup row>
            <Tooltip title={i18n.t("editor.sidebar.keypicker.oneshot.tooltip")}>
              <FormControlLabel
                control={osmControl}
                label={i18n.t("editor.sidebar.keypicker.oneshot.label")}
              />
            </Tooltip>
          </FormGroup>
        </FormControl>
      );
    }

    const isDU = db.isInCategory(key.code, "dualuse");

    return (
      <React.Fragment>
        <Collapsible
          expanded={
            this.isStandardKey(this.props) || this.isOSM() || this.isDualUse()
          }
          title={i18n.t("editor.sidebar.keypicker.title")}
          help={i18n.t("editor.sidebar.keypicker.help")}
        >
          <div className={classes.keyPickButton}>
            <Button variant="contained" onClick={this.openPicker}>
              {i18n.t("editor.sidebar.keypicker.pickAKey")}
            </Button>
          </div>
          <Divider />
          <div className={classes.modContainer}>
            <InputLabel>{i18n.t("editor.sidebar.keypicker.mods")}</InputLabel>
            <FormHelperText>
              {i18n.t("editor.sidebar.keypicker.modsHelp")}
            </FormHelperText>
            <FormControl
              component="fieldset"
              className={classes.mods}
              disabled={!this.isStandardKey(this.props)}
            >
              <FormGroup row>
                <FormControlLabel
                  control={this.makeSwitch("shift")}
                  label="Shift"
                  disabled={key.baseCode == 225 || isDU}
                />
                <FormControlLabel
                  control={this.makeSwitch("ctrl")}
                  label="Control"
                  disabled={key.baseCode == 224 || isDU}
                />
                <FormControlLabel
                  control={this.makeSwitch("alt")}
                  label="Alt"
                  disabled={key.baseCode == 226 || isDU}
                />
                <FormControlLabel
                  control={this.makeSwitch("gui")}
                  label={GuiLabel.full}
                  disabled={key.baseCode == 227 || isDU}
                />
                <FormControlLabel
                  control={this.makeSwitch("altgr")}
                  label="AltGr"
                  disabled={key.baseCode == 230 || isDU}
                />
              </FormGroup>
            </FormControl>
            {oneShot}
          </div>
          <Divider />
          <LayoutSelect
            className={classes.layout}
            layout={this.props.layout}
            setLayout={this.props.setLayout}
          />
        </Collapsible>
        <Dialog
          open={this.state.pickerOpen}
          onClose={this.closePicker}
          fullWidth
          maxWidth="lg"
        >
          <Keyboard104
            onKeySelect={this.onKeyChange}
            currentKeyCode={key.baseCode || key.code}
            keymap={keymap}
          />
        </Dialog>
      </React.Fragment>
    );
  }
}
const KeyPicker = withStyles(styles, { withTheme: true })(KeyPickerBase);

export { KeyPicker as default };
