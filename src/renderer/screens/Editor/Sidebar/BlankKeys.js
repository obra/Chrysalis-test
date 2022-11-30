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
import React from "react";
import { useTranslation } from "react-i18next";
import FKPCategorySelector from "../components/FKPCategorySelector";
import KeyButton from "../components/KeyButton";

const db = new KeymapDB();

const BlankKeys = (props) => {
  const { t } = useTranslation();

  const keys = [
    db.lookup(0), // blocked
    db.lookup(65535), // transparent
  ];

  const keyButtons = keys.map((button, index) => {
    return (
      <KeyButton
        key={`blank-${index}`}
        onKeyChange={props.onKeyChange}
        keyObj={button}
        noHint
      />
    );
  });

  return (
    <FKPCategorySelector
      title={t("editor.sidebar.blanks.title")}
      help={t("editor.sidebar.blanks.help")}
    >
      {keyButtons}
    </FKPCategorySelector>
  );
};

export { BlankKeys as default };
