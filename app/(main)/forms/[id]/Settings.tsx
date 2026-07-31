"use client";

import type { SettingsType } from "@/types/Form";
import { useState } from "react";
import { saveSettings } from "./actions";
import Checkbox from "@/components/ui/Checkbox";
import Btn from "@/components/ui/Btn";

interface SettingsProps {
  id: string;
  existingSettings?: SettingsType;
}

function Settings({ id, existingSettings }: SettingsProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [settings, setSettings] = useState<SettingsType>(
    existingSettings || {
      shuffleQuestions: false,
      shuffleOptions: false,
      allowEditingResponses: true,
      allowMultipleResponses: true,
    },
  );

  async function handleSave() {
    setLoading(true);
    await saveSettings(id, settings);
    setLoading(false);
  }

  return (
    <div className="w-200 mt-8 flex flex-col gap-y-5">
      <div className="border-2 border-gray-700 rounded p-5 flex flex-col gap-y-5 w-full">
        <h1 className="text-white text-2xl font-bold">Form settings</h1>
        <p className="text-gray-300">
          Manage submission defaults, response options, and other form settings
          here!
        </p>
      </div>
      <div className="border-2 border-gray-700 rounded p-5 flex flex-col gap-y-5 w-full">
        <h1 className="text-white text-xl font-bold">Presentation</h1>
        <div className="flex flex-col gap-y-3">
          <Checkbox
            text="Shuffle questions"
            checked={settings.shuffleQuestions}
            setChecked={(shuffleQuestions) =>
              setSettings({ ...settings, shuffleQuestions })
            }
          />
          <Checkbox
            text="Shuffle multiple choice options"
            checked={settings.shuffleOptions}
            setChecked={(shuffleOptions) =>
              setSettings({ ...settings, shuffleOptions })
            }
          />
          <label className="flex gap-x-3 items-center cursor-pointer text-gray-300 text-sm">
            <input
              type="color"
              value={settings.backgroundColor || ""}
              onChange={(e) =>
                setSettings({ ...settings, backgroundColor: e.target.value })
              }
              className="hidden"
            />
            <div
              className="w-8 h-4 rounded border-2 border-gray-700 cursor-pointer"
              style={{ backgroundColor: settings.backgroundColor }}
            />
            <span>
              Background color: {settings.backgroundColor || "Default"}
            </span>
          </label>
        </div>
      </div>
      <div className="border-2 border-gray-700 rounded p-5 flex flex-col gap-y-5 w-full">
        <h1 className="text-white text-xl font-bold">Responses</h1>
        <div className="flex flex-col gap-y-3">
          <Checkbox
            text="Allow submitting another response"
            checked={settings.allowMultipleResponses}
            setChecked={(allowMultipleResponses) =>
              setSettings({ ...settings, allowMultipleResponses })
            }
          />
          <Checkbox
            text="Allow editing responses"
            checked={settings.allowEditingResponses}
            setChecked={(allowEditingResponses) =>
              setSettings({ ...settings, allowEditingResponses })
            }
          />
        </div>
      </div>
      <Btn text={loading ? "Saving..." : "Save"} onclick={handleSave} primary />
    </div>
  );
}

export default Settings;
