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

import KeymapDB from "@api/focus/keymap/db";
import TextField from "@mui/material/TextField";
import React from "react";
import { useTranslation } from "react-i18next";
import FKPCategorySelector from "../components/FKPCategorySelector";

const db = new KeymapDB();

const CustomKey = (props) => {
  const { t } = useTranslation();
  const onKeyChange = (event) => {
    let value = parseInt(event.target.value);
    if (value < 0) {
      value = 65535;
    }
    if (value > 65535) {
      value = 0;
    }
    props.onKeyChange(value);
  };

  const { currentKey: key } = props;

  return (
    <FKPCategorySelector
      title={t("editor.sidebar.custom.title")}
      help={t("editor.sidebar.custom.help")}
    >
      <div>
        <TextField
          label={t("editor.sidebar.custom.label")}
          variant="outlined"
          min={0}
          max={65535}
          value={key.code}
          onChange={onKeyChange}
        />
      </div>
    </FKPCategorySelector>
  );
};

export { CustomKey as default };
