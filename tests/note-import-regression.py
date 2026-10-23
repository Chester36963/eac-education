"""Regression against the exact source DOM that previously lost givens."""
import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('expand_notes', ROOT / 'scripts/expand-notes.py')
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


class ImportRegression(unittest.TestCase):
    def test_same_source_roman_statements_and_equations(self):
        source = mod.SOURCE / 'circle_equation_note/output/v10/Equation_of_Circle_Mastery_Complete_v10.html'
        doc = mod.soup(source)
        for section_id in ['q-Q31', 'q-Q32']:
            for lang in ['.question-en', '.qbody']:
                node = doc.select_one(f'#{section_id} {lang}').select('.mcq-item')[3]
                result = mod.mcq_stem_text(node)
                for marker in ['I.', 'II.', 'III.']:
                    self.assertIn(marker, result)
        for lang in ['.question-en', '.qbody']:
            node = doc.select_one(f'#q-Q39 {lang}').select('.mcq-item')[3]
            result = mod.mcq_stem_text(node)
            self.assertIn('x^2+y^2-4x-6y=0', result)
            self.assertIn('x^2+y^2+2x-2y-14=0', result)

    def test_shared_displayed_equation(self):
        doc = mod.soup(mod.SOURCE / 'circle_equation_note/output/v10/Equation_of_Circle_Mastery_Complete_v10.html')
        section = doc.select_one('#q-Q76')
        restored = mod.shared_reference_body(section.select_one('.question-en'), section.select_one('.qbody'))
        self.assertIn('432-120k=0', mod.text(restored))
        self.assertIn('432-120k=0', mod.text(restored.select_one('.math-block')))


if __name__ == '__main__':
    unittest.main()
