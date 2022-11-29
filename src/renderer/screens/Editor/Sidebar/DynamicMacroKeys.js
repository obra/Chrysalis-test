// -*- mode: js-jsx -*-
/* Chrysalis -- Kaleidoscope Command Center
 * Copyright (C) 2020-2022  Keyboardio, Inc.
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
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import usePluginVisibility from "@renderer/hooks/usePluginVisibility";
import FKPCategorySelector from "../components/FKPCategorySelector";

import Macros from "@api/focus/macros";
import KeymapDB from "@api/focus/keymap/db";

const DynamicMacroKeys = (props) => {
  const { currentKey } = props;
  const { t } = useTranslation();

  const pluginVisible = usePluginVisibility("DynamicMacros");
  if (!pluginVisible) return null;

  if (!props.macros) return null;

  const m = new Macros();
  const db = new KeymapDB();

  const used = m.getStoredSize(props.macros);
  const disabled =
    (currentKey && !db.isInCategory(currentKey, "dynmacros")) ||
    props.macroEditorOpen;

  const onClick = () => {
    props.setOpenMacroEditor(true);
  };

  return (
    <>
      <FKPCategorySelector
        help={t("editor.sidebar.dynmacros.help")}
        category="dynmacros"
        currentKey={currentKey}
        onKeyChange={props.onKeyChange}
      />
      {props.macros.storageSize > 0 && (
        <Grid container>
          <Grid item sm={9} spacing={2}>
            <Paper
              variant="outlined"
              sx={{
                p: 1,
                justifyContent: "center",
                display: "flex",
              }}
            >
              <Typography variant="body2">
                {t("editor.sidebar.dynmacros.usage_overview.label")}{" "}
                <strong>
                  {t("editor.sidebar.dynmacros.usage_overview.usage", {
                    used: used,
                    size: props.macros.storageSize,
                  })}
                </strong>{" "}
                {t("editor.sidebar.dynmacros.usage_overview.bytes")}
              </Typography>
            </Paper>
          </Grid>
          <Grid item sm={3}>
            <Button variant="contained" disabled={disabled} onClick={onClick}>
              {t("editor.macros.edit")}
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export { DynamicMacroKeys as default };
