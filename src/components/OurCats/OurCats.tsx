import React, { useState } from 'react';
import useMediaQuery from 'src/hooks/useMediaQuery';

import Button from '../Button/Button';
import CatCard from '../CatCard/CatCard';
import ModalShowCat from '../CatCard/ModalShowCat/ModalShowCat';

import s from './OurCats.module.scss';
import { useGetCatsQuery, useReserveCatMutation } from 'src/store/slice/catsSlice';

const OurCats: React.FC = () => {
	const { data: cats = [] } = useGetCatsQuery('');
	const [reserveCat] = useReserveCatMutation();

	const { isTablet, isDesktop } = useMediaQuery();
	const [isShowMore, setIsShowMore] = useState(false);
	const [isModalCatID, setIsModalCatID] = useState<number>();
	const [isCatModalOpen, setIsCatModalOpen] = useState(false);

	const slicedCats = !isTablet && !isShowMore ? cats?.slice(0, 3) : cats;

	const handleShowMoreClick = () => {
		setIsShowMore(true);
	};
	const closeCatModal = () => {
		setIsCatModalOpen(false);
	};
	const openModal = () => {
		setIsCatModalOpen(true);
	};
	const onCatCardClick = (id: number) => {
		setIsModalCatID(id);
		openModal();
	};

	const onBookedClick = async (id: number) => {
		await reserveCat(id).unwrap();
	};

	return (
		<section id="ourCats" className={s.wrapper}>
			<h2 className={s.title}>Наші кошенята</h2>
			<div className={s.cats}>
				{slicedCats.map((cat) => (
					<CatCard
						key={cat.id}
						{...cat}
						onCatCardClick={onCatCardClick}
						onBookedClick={onBookedClick}
					/>
				))}
			</div>
			{!isTablet && slicedCats.length <= 3 && cats.length > 3 && (
				<div className={s.btnContainer}>
					<Button
						onClick={handleShowMoreClick}
						name="Показати більше"
						buttonClasses={'secondaryBtn'}
						styleBtn={{ width: '100%' }}
					/>
				</div>
			)}
			{isCatModalOpen &&
				slicedCats
					.filter((item) => item.id === isModalCatID)
					.map((cat) => (
						<ModalShowCat
							key={cat.id}
							closeModal={closeCatModal}
							children={
								<CatCard
									setIsCatModalOpen={setIsCatModalOpen}
									onBookedClick={onBookedClick}
									variant={isDesktop ? 'desktopModal' : 'tabletModal'}
									{...cat}
								/>
							}
							variant={isDesktop ? 'desktopModal' : 'tabletModal'}
						/>
					))}
		</section>
	);
};

export default OurCats;
