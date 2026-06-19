import Modal from '../components/Modal';
import ChapterWise from './ChapterWise';
import type { TestFormState } from '../types';

interface EditTestModalProps {
  open: boolean;
  initial?: Partial<TestFormState>;
  onClose: () => void;
  onSave: (data: TestFormState) => Promise<void>;
}

export default function EditTestModal({ open, initial, onClose, onSave }: EditTestModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Edit Test creation">
      <ChapterWise
        initial={initial}
        onBack={onClose}
        onSave={onSave}
        editMode
      />
    </Modal>
  );
}
