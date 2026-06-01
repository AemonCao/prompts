[CmdletBinding()]
param(
    [string]$Root = ".",

    [Parameter(Mandatory = $true)]
    [ValidateSet("coding", "writing", "business", "personal", "multimodal")]
    [string]$Category,

    [Parameter(Mandatory = $true)]
    [string]$Slug,

    [Parameter(Mandatory = $true)]
    [string]$Name,

    [Parameter(Mandatory = $true)]
    [string]$NameZh,

    [string]$Summary = "",
    [Parameter(Mandatory = $true)]
    [string]$SummaryZh,
    [string]$Tags = "",
    [Parameter(Mandatory = $true)]
    [string]$TagsZh,
    [string]$Inputs = "",
    [string]$Outputs = "markdown",
    [string]$Language = "zh-CN",
    [string]$ModelHints = "",
    [ValidateSet("draft", "stable", "deprecated")]
    [string]$Status = "draft",
    [string]$PromptPath,
    [switch]$WithScaffold,
    [switch]$Force,

    [Parameter(ValueFromPipeline = $true)]
    [string[]]$PipedPrompt
)

begin {
    $ErrorActionPreference = "Stop"
    $promptLines = New-Object System.Collections.Generic.List[string]
}

process {
    if ($null -ne $PipedPrompt) {
        foreach ($line in $PipedPrompt) {
            $promptLines.Add($line)
        }
    }
}

end {
    function ConvertTo-Slug {
        param([string]$Value)

        $normalized = $Value.ToLowerInvariant() -replace "[^a-z0-9]+", "-"
        $normalized = $normalized.Trim("-")
        if ([string]::IsNullOrWhiteSpace($normalized)) {
            throw "Slug must contain at least one ASCII letter or digit."
        }
        return $normalized
    }

    function Split-CommaList {
        param([string]$Value)

        if ([string]::IsNullOrWhiteSpace($Value)) {
            return @()
        }

        return @(
            $Value -split "," |
                ForEach-Object { $_.Trim() } |
                Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
        )
    }

    function Quote-Yaml {
        param([AllowNull()][string]$Value)

        if ($null -eq $Value) {
            return "''"
        }

        $singleLine = ([string]$Value) -replace "(`r`n|`n|`r)", " "
        return "'" + $singleLine.Replace("'", "''") + "'"
    }

    $resolvedRoot = (Resolve-Path -LiteralPath $Root).Path
    $promptsRoot = Join-Path $resolvedRoot "prompts"
    if (-not (Test-Path -LiteralPath $promptsRoot -PathType Container)) {
        throw "Could not find prompts directory under root: $resolvedRoot"
    }

    if ($PromptPath) {
        $prompt = Get-Content -LiteralPath $PromptPath -Raw
    }
    elseif ($promptLines.Count -gt 0) {
        $prompt = $promptLines -join [Environment]::NewLine
    }
    else {
        throw "Provide prompt text through the pipeline or with -PromptPath."
    }

    $cleanSlug = ConvertTo-Slug $Slug
    $categoryPath = Join-Path $promptsRoot $Category
    $targetPath = Join-Path $categoryPath $cleanSlug

    if ((Test-Path -LiteralPath $targetPath) -and -not $Force) {
        throw "Target already exists: $targetPath. Choose a different slug or pass -Force."
    }

    New-Item -ItemType Directory -Force -Path $targetPath | Out-Null

    $promptPathOut = Join-Path $targetPath "prompt.md"
    $metaPathOut = Join-Path $targetPath "meta.yaml"
    $date = Get-Date -Format "yyyy-MM-dd"
    $id = "$Category.$($cleanSlug -replace '-', '_')"
    $tagList = Split-CommaList $Tags
    $tagZhList = Split-CommaList $TagsZh
    $inputList = Split-CommaList $Inputs
    $modelHintList = Split-CommaList $ModelHints

    Set-Content -LiteralPath $promptPathOut -Value $prompt -Encoding utf8 -NoNewline

    $meta = New-Object System.Collections.Generic.List[string]
    $meta.Add("id: $(Quote-Yaml $id)")
    $meta.Add("name: $(Quote-Yaml $Name)")
    $meta.Add("name_zh: $(Quote-Yaml $NameZh)")
    $meta.Add("version: '1.0.0'")
    $meta.Add("status: $(Quote-Yaml $Status)")
    $meta.Add("category: $(Quote-Yaml $Category)")
    $meta.Add("summary: $(Quote-Yaml $Summary)")
    $meta.Add("summary_zh: $(Quote-Yaml $SummaryZh)")

    if ($tagList.Count -eq 0) {
        $meta.Add("tags: []")
    }
    else {
        $meta.Add("tags:")
        foreach ($tag in $tagList) {
            $meta.Add("  - $(Quote-Yaml $tag)")
        }
    }

    if ($tagZhList.Count -eq 0) {
        $meta.Add("tags_zh: []")
    }
    else {
        $meta.Add("tags_zh:")
        foreach ($tag in $tagZhList) {
            $meta.Add("  - $(Quote-Yaml $tag)")
        }
    }

    if ($inputList.Count -eq 0) {
        $meta.Add("inputs: []")
    }
    else {
        $meta.Add("inputs:")
        foreach ($inputName in $inputList) {
            $meta.Add("  - name: $(Quote-Yaml $inputName)")
            $meta.Add("    required: true")
            $meta.Add("    description: ''")
        }
    }

    $meta.Add("outputs:")
    $meta.Add("  format: $(Quote-Yaml $Outputs)")
    $meta.Add("language: $(Quote-Yaml $Language)")

    if ($modelHintList.Count -gt 0) {
        $meta.Add("model_hint:")
        foreach ($modelHint in $modelHintList) {
            $meta.Add("  - $(Quote-Yaml $modelHint)")
        }
    }

    $meta.Add("created: $(Quote-Yaml $date)")
    $meta.Add("updated: $(Quote-Yaml $date)")

    Set-Content -LiteralPath $metaPathOut -Value ($meta -join [Environment]::NewLine) -Encoding utf8

    if ($WithScaffold) {
        Set-Content -LiteralPath (Join-Path $targetPath "examples.md") -Value "# Examples`n`n" -Encoding utf8
        Set-Content -LiteralPath (Join-Path $targetPath "tests.yaml") -Value "cases: []`n" -Encoding utf8
    }

    Write-Output "Created prompt entry: $targetPath"
}
