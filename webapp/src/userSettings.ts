// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

export class UserSettings {
    static get prefillRandomIcons(): boolean {
        return localStorage.getItem('randomIcons') !== 'false'
    }

    static set prefillRandomIcons(newValue: boolean) {
        localStorage.setItem('randomIcons', JSON.stringify(newValue))
    }
}

const keys = ['language', 'theme', 'lastBoardId', 'lastViewId', 'emoji-mart.last', 'emoji-mart.frequently']

export function exportUserSettingsBlob(): string {
    return window.btoa(exportUserSettings())
}

function exportUserSettings(): string {
    const settings = Object.fromEntries(keys.map((key) => [key, localStorage.getItem(key)]))
    settings.timestamp = `${Date.now()}`
    return JSON.stringify(settings)
}

export function importUserSettingsBlob(blob: string): boolean {
    return importUserSettings(window.atob(blob))
}

function importUserSettings(json: string): boolean {
    const settings = parseUserSettings(json)
    const timestamp = settings.timestamp
    const lastTimestamp = localStorage.getItem('timestamp')
    if (!timestamp || (lastTimestamp && Number(timestamp) <= Number(lastTimestamp))) {
        return false
    }
    for (const [key, value] of Object.entries(settings)) {
        localStorage.setItem(key, value as string)
    }
    return true
}

function parseUserSettings(json: string): any {
    try {
        return JSON.parse(json)
    } catch (e) {
        return {}
    }
}
