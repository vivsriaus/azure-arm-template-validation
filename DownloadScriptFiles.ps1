Write-Host "Downloading script files..."
wget "https://github.com/vivsriaus/solutiontemplatevalidation/blob/master/validationscriptpackage.zip?raw=true" -OutFile "validationscriptpackage.zip"
Write-Host "Listing files to ensure download was successful..."
dir