Write-Host "Downloading script files..."
wget "https://github.com/vivsriaus/solutiontemplatevalidation/blob/master/validationscriptpackage.zip?raw=true" -OutFile "validationscriptpackage.zip"
Write-Host "Listing files to ensure download was successful..."
dir
Write-Host "Removing existing files to avoid confirmation prompt when extracting validationscriptpackage.zip..."
if(Test-Path .\test) {
    try {
        Remove-Item .\test\ -Force -Recurse
    }
    catch {
        Write-Host "Exception caught when removing test directory. Moving on..."
    }
}

if(Test-Path .\GruntFile.js) {
    try {
        Remove-Item .\GruntFile.js -Force
    }
    catch {
        Write-Host "Exception caught when removing grunt file. Moving on..."
    }
}

if(Test-Path .\package.json) {
    try {
        Remove-Item .\package.json -Force -Recurse
    }
    catch {
        Write-Host "Exception caught when removing package json. Moving on..."
    }
}

