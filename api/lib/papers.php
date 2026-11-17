<?php
declare(strict_types=1);

function paper_list_item(array $row): array
{
    $abstract = (string) ($row['abstract'] ?? '');
    if (mb_strlen($abstract) > 500) {
        $abstract = mb_substr($abstract, 0, 500);
    }
    return [
        'id' => $row['id'],
        'title' => $row['title'],
        'year' => isset($row['year']) ? (int) $row['year'] : null,
        'venue' => $row['venue'],
        'url' => $row['url'],
        'pdfUrl' => $row['pdf_url'] ?? '',
        'htmlUrl' => $row['html_url'] ?? '',
        'journalUrl' => $row['journal_url'] ?? '',
        'doi' => $row['doi'] ?? '',
        'journal' => $row['journal'] ?? '',
        'authors' => json_decode_array($row['authors_json'] ?? '[]'),
        'abstract' => $abstract,
        'tags' => json_decode_array($row['tags_json'] ?? '[]'),
        'keywords' => json_decode_array($row['keywords_json'] ?? '[]'),
        'categories' => json_decode_array($row['categories_json'] ?? '[]'),
        'track' => $row['track'] ?? 'ml-general',
        'tier' => $row['tier'] ?? 'recent',
        'source' => $row['source'] ?? null,
    ];
}

function paper_full(array $row): array
{
    $item = paper_list_item($row);
    $item['abstract'] = $row['abstract'] ?? '';
    $algo = json_decode_array($row['algorithm_json'] ?? '{}');
    if ($algo === []) {
        $algo = ['fa' => '', 'en' => '', 'ar' => '', 'ku' => ''];
    }
    $item['algorithm'] = $algo;
    return $item;
}

function venue_item(array $row): array
{
    return [
        'id' => $row['id'],
        'kind' => $row['kind'],
        'name' => $row['name'],
        'abbr' => $row['abbr'],
        'publisher' => $row['publisher'],
        'impactFactor' => (float) ($row['impact_factor'] ?? 0),
        'h5Index' => isset($row['h5_index']) ? (int) $row['h5_index'] : null,
        'metricKind' => $row['metric_kind'],
        'metricLabel' => $row['metric_label'],
        'metricYear' => isset($row['metric_year']) ? (int) $row['metric_year'] : null,
        'citationNote' => $row['citation_note'],
        'rigor' => (int) ($row['rigor'] ?? 3),
        'acceptanceHint' => $row['acceptance_hint'],
        'domains' => json_decode_array($row['domains_json'] ?? '[]'),
        'keywords' => json_decode_array($row['keywords_json'] ?? '[]'),
        'specialty' => $row['specialty'],
        'url' => $row['url'],
        'issn' => $row['issn'] ?? '',
        'notes' => $row['notes'] ?? '',
    ];
}
