#!/usr/bin/env python3
import importlib.util, tempfile, unittest, zipfile
from pathlib import Path
spec=importlib.util.spec_from_file_location('intake',Path(__file__).resolve().parents[1]/'scripts/inventory-curriculum.py')
intake=importlib.util.module_from_spec(spec);spec.loader.exec_module(intake)
class InventoryTest(unittest.TestCase):
    def test_read_only_archive_and_document_inventory(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)
            for group in intake.GROUPS:(root/group).mkdir()
            folder=root/'S1'/'numbers';folder.mkdir()
            document=folder/'exercise.docx'
            with zipfile.ZipFile(document,'w') as z:
                z.writestr('word/document.xml','<w:document xmlns:w="w"><w:t>Find the sum of two numbers.</w:t></w:document>')
                z.writestr('word/media/image1.png',b'not-a-final-student-image')
            original=document.read_bytes()
            archive=root/'S1'/'backup.zip'
            with zipfile.ZipFile(archive,'w') as z:
                z.writestr('numbers/exercise.docx',original)
                z.writestr('__MACOSX/._junk',b'ignored')
            (folder/'.DS_Store').write_bytes(b'ignored')
            result=intake.scan(root)
            self.assertEqual(len(result['sources']),3)
            self.assertEqual(len(result['exactDuplicateGroups']),1)
            self.assertEqual(result['summary']['S1']['archiveMembers'],1)
            row=next(r for r in result['sources'] if r['path'].endswith('/exercise.docx') and not r['container'])
            self.assertEqual(row['documentSignals']['mediaFiles'],1)
            self.assertEqual(result['evidence'][0]['text'],'Find the sum of two numbers.')
            self.assertTrue(all(r['questionCount'] is None for r in result['sources']))
            self.assertEqual(document.read_bytes(),original)
            self.assertFalse((root/'S1'/'backup').exists())
    def test_missing_scope_is_not_silently_skipped(self):
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaisesRegex(ValueError,'Missing supplied folder'):intake.scan(Path(tmp))
    def test_unsafe_archive_paths_are_rejected_without_extraction(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)
            for group in intake.GROUPS:(root/group).mkdir()
            with zipfile.ZipFile(root/'S3'/'unsafe.zip','w') as z:z.writestr('../outside.docx',b'bad')
            with self.assertRaisesRegex(ValueError,'Unsafe archive member'):intake.scan(root)
            self.assertFalse((root/'outside.docx').exists())
if __name__=='__main__':unittest.main()
