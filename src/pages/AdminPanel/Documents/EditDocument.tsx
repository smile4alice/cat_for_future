import {
	useEditDocumentMutation,
	useGetDocumentByIdQuery,
} from 'src/store/slice/documentsSlice.ts';
import { useParams } from 'react-router';
import styles from './EditDocument.module.scss';
import { AlertCircle, ChevronLeft, ScrollText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from 'react';
import ButtonAdmin from 'src/components/AdminPanel/UIKit/Button/ButtonAdmin.tsx';
import ModalAdmin from 'src/components/AdminPanel/Modal/ModalAdmin.tsx';
import SuccessModal from 'src/components/AdminPanel/Modal/SuccessModal.tsx';
import QuestionModal from 'src/components/AdminPanel/Modal/QuestionModal.tsx';

const EditDocument = () => {
	const { id } = useParams();
	const { data: document } = useGetDocumentByIdQuery(id);
	const [valueName, setValueName] = useState('');
	const [errorFile, setErrorFile] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const [editDocument, { isSuccess, isError }] = useEditDocumentMutation();
	const [isQuestion, setIsQuestion] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (document) {
			setValueName(document.name);
		}
	}, [document]);

	const path = file ? file?.name.slice(0, 15) : document?.media_path.split('/').pop();

	const MAX_SIZE = 2 * 1024 * 1024;
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files ? event.target.files[0] : null;
		if (file) {
			setErrorFile('');

			if (file.size > MAX_SIZE) {
				setErrorFile('Максимальний розміру файлу 2 Мб');
			} else {
				setFile(file);
			}
		}
	};

	const submitFormHandler = async () => {
		const formData = new FormData();
		if (file) {
			formData.append('media_path', file);
		}
		if (valueName) {
			formData.append('name', valueName);
		}

		await editDocument({ formData, id }).unwrap();
	};

	return (
		<div className={styles.container}>
			<div onClick={() => setIsQuestion(true)} className={styles.header}>
				<ChevronLeft /> Редагувати
			</div>
			<div className={styles.formWrapper}>
				{isSuccess && (
					<ModalAdmin onClose={() => navigate(-1)}>
						<SuccessModal text="Ваші зміни успішно збережено!" />
					</ModalAdmin>
				)}
				{isQuestion && (
					<ModalAdmin onClose={() => setIsQuestion(false)}>
						<QuestionModal
							successFnc={() => navigate('/admin/documents')}
							declineFnc={() => setIsQuestion(false)}
							question="Ви впевнені що бажаєте залишити сторінку?"
							text="Ваші зміни не буде збережені"
							btnRight="ТАК"
							btnLeft="НІ"
						/>
					</ModalAdmin>
				)}
				{isError && <div>error</div>}
				<label htmlFor="document-name">
					<span>Назва документу</span>
					<input
						id="document-name"
						name="Name"
						type="text"
						value={valueName}
						onChange={(e) => setValueName(e.target.value)}
					/>
				</label>
				<label htmlFor="document-file" style={{ width: '15.625rem' }}>
					<span>Документ</span>
					<div className={styles.fileInput}>
						<div className={styles.icon}>
							<ScrollText strokeWidth={1} />
						</div>
						{errorFile ? (
							<div className={styles.error}>
								<div>
									<AlertCircle color="#F40000" size={14} />
								</div>
								{errorFile}
							</div>
						) : (
							<p>{path}</p>
						)}
					</div>
					<input
						id="document-file"
						onChange={handleFileChange}
						name="File"
						type="file"
						accept="application/pdf"
						style={{ display: 'none' }}
					/>
				</label>
				<div className={styles.button}>
					<ButtonAdmin
						text={'Зберегти'}
						disabled={!!errorFile || valueName.length <= 2}
						onClick={submitFormHandler}
					/>
				</div>
			</div>
		</div>
	);
};

export default EditDocument;
