import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('queue', Path(__file__).resolve().parents[1] / 'scripts/bulk-intake-queue.py')
queue = importlib.util.module_from_spec(spec)
spec.loader.exec_module(queue)


class QueueTests(unittest.TestCase):
    def source(self):
        return {'id': 's', 'sha256': 'current', 'path': 'a.pdf'}

    def test_unknown_is_not_zero(self):
        row = queue.reconcile([self.source()], [], [])[0]
        self.assertIsNone(row['confirmedSourceQuestions'])
        self.assertEqual(row['questionCountLabel'], '未點清')

    def test_receipt_does_not_prove_publication(self):
        batch = {'id': 'b', 'sourceId': 's', 'sourceSha256': 'current',
                 'expectedQuestions': 1, 'records': [{'disposition': 'publish'}], 'import': {'at': 'today'}}
        row = queue.reconcile([self.source()], [batch], [])[0]
        self.assertEqual(row['publishedUniqueQuestions'], 0)
        self.assertEqual(row['workStatus'], '處理中')

    def test_alias_deduplicates_unique_question(self):
        q = {'id': 'q', 'provenance': {'sha256': 'current'},
             'sourceAliases': [{'sourceId': 's', 'sha256': 'current'}]}
        row = queue.reconcile([self.source()], [], [q])[0]
        self.assertEqual(row['publishedQuestionIds'], ['q'])

    def test_changed_version_cannot_reuse_count_or_published_status(self):
        b = {'id': 'b', 'sourceId': 's', 'sourceSha256': 'old', 'expectedQuestions': 8}
        q = {'id': 'q', 'provenance': {'sourceId': 's', 'sha256': 'old'}}
        row = queue.reconcile([self.source()], [b], [q])[0]
        self.assertIsNone(row['confirmedSourceQuestions'])
        self.assertEqual(row['publishedUniqueQuestions'], 0)
        self.assertEqual(row['otherOrUnknownVersionQuestionIds'], ['q'])
        self.assertTrue(row['sourceVersionMismatch'])

    def test_conflicting_counts_require_reconciliation(self):
        batches = [{'id': str(n), 'sourceId': 's', 'sourceSha256': 'current',
                    'expectedQuestions': n} for n in (2, 3)]
        row = queue.reconcile([self.source()], batches, [])[0]
        self.assertTrue(row['needsReconciliation'])
        self.assertIsNone(row['confirmedSourceQuestions'])

    def test_existing_challenging_level_is_preserved(self):
        q = {'id': 'q', '_topicId': 't', 'skill': 'k', 'subcategory': 'sub',
             'difficulty': 'challenging', 'classification': {'difficultyReason': 'case analysis'}}
        catalog = {'difficultyLevels': ['easy', 'medium', 'hard', 'challenging'],
                   'subjects': [{'chapters': [{'subcategories': [{'id': 'sub', 'skills': ['k']}]}]}]}
        self.assertEqual(queue.audit_questions([q], {'k': 'Skill'}, catalog), [])


if __name__ == '__main__':
    unittest.main()
