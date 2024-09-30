## Installation and Use Instructions
### Installation
1. Install NodeJS by running the following commands in a terminal:
```
sudo apt update
sudo apt install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```
Close and reopen the terminal, run the 2 following commands:
```
nvm install latest
nvm use latest
```
2. Download all Files
   1. For advanced users use Git
   2. Otherwise use the Code>Download Zip option in the GitHub repository and unzip the files
3. Run the "Install-All.sh" file (Right Click > Run as a Program)
### Usage
1. Run the "Start-All.sh" file (Right Click > Run as a Program)
### Notes
- The exhibit "Hörtest" requires 100% system volume, however it can't be changed once the dashboard is launched, so make sure to set systemvolume to the maximum before launching
- The app can only be quit using the button in the bottom right of the dashboard. The standard password to exit is 123, but it can be changed in the Dash/main.js file
- The stats-server isn't quit properly by using the button. Either restart the machine when wanting to reopen the dash or run `pkill -f node` in a terminal before continuing.

## Anleitung zur Installation und Benutzung der Exponate

### Installation
1. NodeJS mit den folgenden commands im Terminal installieren:
```
sudo apt update
sudo apt install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```
Das Terminal schließen und wieder öffnen, und die folgenden Commands ausführen:
```
nvm install 20
nvm use 20
```
2. Alle Dateien herunterladen
    1. Für fortgeschrittene Benutzer über Git
    2. Sonst über GitHub>Code>Download Zip und entpacken

3. Die "Install-All.sh" Datei ausführen (Rechtsclick > Als Programm Ausführen)
### Benutzung
1. Die "Start-All.sh" Datei ausführen (Rechtsclick > Als Programm Ausführen)
### Hinweise
- Die System-Lautstärkeeinstellungen auf dem PC müssen auf 100% gestellt werden, sonst misst das Exponat Hörtest nicht korrekt.
- Die app kann nur über den button unten rechts im dashboard mit einem Passwort geschlossen werden. Das Standard Passwort ist 123 aber dieses kann in der Dash/Main.js Datei verändert werden.
- Der Statistik-Server wird beim schließen nicht vernünftig beendet. Wenn das dashboard nach dem schließen wieder geöffnet werden soll, entweder erst das System neustarten oder in einem Terminal `pkill -f node` ausführen.