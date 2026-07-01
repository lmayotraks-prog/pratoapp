Add-Type -AssemblyName System.Drawing
$images = Get-ChildItem -Path "material audiovisual martin prato" -Recurse -Include *.jpg,*.jpeg,*.png
foreach ($img in $images) {
    if ($img.Length -gt 500000) {
        Write-Host "Compressing $($img.Name)..."
        $bmp = [System.Drawing.Image]::FromFile($img.FullName)
        $scale = 800.0 / $bmp.Width
        if ($scale -ge 1) { $bmp.Dispose(); continue }
        $newWidth = 800
        $newHeight = [math]::Round($bmp.Height * $scale)
        $newBmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $g = [System.Drawing.Graphics]::FromImage($newBmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($bmp, 0, 0, $newWidth, $newHeight)
        $g.Dispose()
        $bmp.Dispose()
        
        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 75L)
        
        $newBmp.Save($img.FullName, $codec, $encParams)
        $newBmp.Dispose()
    }
}
