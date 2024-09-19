## Anleitung für die Benutzung der Exponate

1. Das Betriebssystem auswählen. Die Exponate sind einmal für Windows und einmal für Ubuntu-Linux basierende Systeme kompiliert. Ich empfehle stark den Gebrauch von Pop! OS wenn Linux verwendet wird, da dieses Betriebssystem die Iiyama Touchscreens sowie eine Touch-Tastatur unterstützt, bei anderen Distributionen gab es Probleme. 

2. (Optional) Den server starten um statistische Daten zu sammeln

3. Die Programme Ausführen. Bei Linux das "run-EXPONATENNAME.sh" script ausführen, bei Windows die EXPONATENNAME.exe 

4. Um das Programm zu maximieren, auf das Zahlrad-Symbol oben rechts klicken und "Vollbild an" auswählen. Hier kann auch die Ausrichtung angepasst werden, je nachdem der Monitor Senkrecht oder Wegerecht ist. Es wird auch angezeigt, ob der Server online ist (dieser ist nur lokal).


**Speziell für das Exponat Hörtest: Die System-Lautstärkeeinstellungen auf dem PC müssen auf 100% gestellt werden, sonst misst das Exponat nicht korrekt.**


## Wenn Änderungen im Quellcode vorgenommen wurden, so muss dieser neu Kompiliert werden

Wenn Windows verwendet wird, muss zuerst die Möglichkeit bestehen, bash-Skripte auszuführen. bash kann hier (https://git-scm.com/download/win) heruntergeladen und installiert werden.

Anschließend wird node (https://nodejs.org/en) benötigt, um diese Anwendungen auszuführen und zu kompilieren. Es wird empfohlen, node mit nvm zu installieren. Eine Anleitung zum Herunterladen und Installieren von nvm gibt es hier (https://github.com/nvm-sh/nvm).

Sobald nvm installiert ist, können die folgenden Befehle ausgeführt werden, um die benötigte node-Version herunterzuladen und zu verwenden (Administratorrechte könnten erforderlich sein):

```
nvm install 20.11.0
nvm use 20.11.0
```


Wenn node installiert ist, müssen yarn und pkg als globale Pakete verfügbar sein. Diese können mit npm, einem in node enthaltenen Paketmanager, installiert werden:

```
npm install --global yarn
npm install --global @yao-pkg/pkg
```

Nun ist alles vorhanden, um diese Anwendungen zu kompilieren. Es gibt sowohl Linux- als auch Windows-Skripte, um dies zu tun.

Windows:
Das Skript kann entweder durch Doppelklicken auf win-build.sh oder durch Ausführen von .\win-build.sh in einem bash-Terminal gestartet werden.

Linux:
Zuerst müssen die Ausführungsrechte für das Skript festgelegt werden, danach kann es ausgeführt werden:

```
sudo chmod +x build.sh
./build.sh
```