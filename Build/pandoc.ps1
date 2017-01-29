function GetVersionNumber{
    $output = $null
    do {
        $output = Read-Host 'What is the current version?'
    }
    while (!$output)
    return $output
}

function ZipFiles{
    param($filesDirectory, $docsDirectory, $versionData)
    $filesOutput = "allfiles-v" + $versionData + ".zip"
    $docsOutput = "lab_instructions-v" + $versionData + ".zip"
    Write-Zip ($filesDirectory + "*") -OutputPath $filesOutput -IncludeEmptyDirectories
    Write-Zip ($docsDirectory + "*.docx") -OutputPath $docsOutput
}

function CloseWord{
    Get-Process WINWORD | Stop-Process
}

function AddVersionFooter{
    param($file, $versionData)
    $filePath = (Resolve-Path $file).Path
    $Word = New-Object -ComObject Word.Application
    $Doc = $Word.Documents.Open($filePath)
    $Section = $Doc.Sections.Item(1)
    $Footer = $Section.Footers.Item(1)
    $Footer.Range.Text = "Version: " + $versionData
    $Doc.Save()
    # save pdf also
    $pdf_filename = ($filePath).replace('docx', 'pdf')
    $Doc.SaveAs($pdf_filename, 17)
    $Doc.Close()
    CloseWord
}

function ConvertMarkdownToWord{
    param($inputFile, $outputFile, $versionData)
    Write-Host "Converting $inputFile"
    pandoc $inputFile.FullName -o $outputFile --reference-docx=template.docx 
    AddVersionFooter $outputFile $versionData
}

$docsInputDirectory = "..\Instructions\"
$filesInputDirectory = "..\Allfiles\"
$outputDirectory = "Temp\"
$docsOutputDirectory = $outputDirectory + "Lab Instructions\"
$filesOutputDirectory = $outputDirectory + "Allfiles\"

$version = GetVersionNumber

' Create Temp Directory'
New-Item -ItemType Directory -Force -Path $docsOutputDirectory

CloseWord

' Create Lab Word Documents'
foreach($file in Get-ChildItem $docsInputDirectory -Recurse | Where-Object {$_.Extension -eq ".md"})
{
    $inputFile = $file;
    $outputFile = $docsOutputDirectory + $file.BaseName + '.docx'
    ConvertMarkdownToWord $inputFile $outputFile $version
}

' Copy AllFiles '
' Copy-Item $filesInputDirectory –Destination $outputDirectory -Recurse -Container '

' Compress AllFiles & Lab Instructions '
ZipFiles $filesOutputDirectory $docsOutputDirectory $version

' Remove Temp Directory'
Remove-Item $outputDirectory -Force -Recurse