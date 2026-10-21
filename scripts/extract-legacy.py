"""Read the supplied HTML as data; never evaluate its embedded JavaScript."""
import hashlib
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]


def extract(filename):
    raw = pathlib.Path(filename).read_bytes()
    text = raw.decode('utf-8-sig')
    anchor = re.search(r'\bconst QUESTIONS\s*=\s*', text)
    if not anchor:
        raise ValueError('No QUESTIONS JSON literal found')
    questions, end = json.JSONDecoder().raw_decode(text[anchor.end():])
    if not text[anchor.end() + end:].lstrip().startswith(';'):
        raise ValueError('QUESTIONS must be a strict standalone JSON literal')
    counts = {topic: {kind: len(rows) for kind, rows in groups.items()}
              for topic, groups in questions.items()}
    return {'origin': {'filename': str(pathlib.Path(filename).resolve()),
                       'sha256': hashlib.sha256(raw).hexdigest(),
                       'bytes': len(raw), 'counts': counts},
            'questions': questions}


if __name__ == '__main__':
    data = extract(sys.argv[1])
    destination = ROOT / 'content' / 'sources' / '1013-webpage.json'
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'saved': str(destination), **data['origin']}, ensure_ascii=False))
