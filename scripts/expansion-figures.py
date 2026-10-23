"""Editable reconstructions from individually inspected same-question crops."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'src/assets/notes'


def svg(body, width=480, height=320):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img"><g fill="none" stroke="#303a44" stroke-width="1.5">{body}</g></svg>'


def labels(points):
    return '<g stroke="none" fill="#303a44" font-family="Georgia,serif" font-style="italic" font-size="17">' + ''.join(f'<text x="{x}" y="{y}">{t}</text>' for t, x, y in points) + '</g>'


FIGURES = {
 'note-circle-equation-official-mcq-equation-read-1-1': svg('<path d="M50 265H425m-12-6 12 6-12 6M295 300V28m-6 12 6-12 6 12"/><circle cx="235" cy="132" r="100"/>'+labels([('x',421,287),('y',279,28),('O',275,286)])),
 'import-four-centres-q238-1': svg('<circle cx="240" cy="196" r="64"/><path d="M48 260L240 116L432 260ZM240 260L201.6 144.8L278.4 144.8Z"/>' + labels([('O',30,277),('P',236,103),('Q',438,277),('A',234,281),('B',183,141),('C',284,141)])),
 'note-circle-equation-q68-1': svg('<circle cx="240" cy="160" r="72"/><path d="M168 35.292L276 97.646L276 222.354L168 284.708ZM168 35.292L276 222.354"/><circle cx="240" cy="160" r="2" fill="#303a44"/><path d="M181.86 43.292A16 16 0 0 1 176 49.148"/>' + labels([('D',155,27),('E',151,306),('A',146,165),('B',282,96),('C',282,235),('O',220,157),('30°',184,69)])),
 'note-circle-equation-q69-1': svg('<circle cx="125" cy="112" r="96.933"/><path d="M125 112L305 184L125 184L125 373L215 148ZM125 184h12v-12h-12"/>' + labels([('G',111,101),('A',224,146),('B',312,189),('O',106,189),('D',114,395),('C',193,206)]),350,410),
}


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    for key, body in FIGURES.items():
        (OUT / (key + '.svg')).write_text(body + '\n')
