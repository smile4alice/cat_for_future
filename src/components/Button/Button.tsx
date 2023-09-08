import React from 'react';

import s from './Button.module.scss';
import clsx from 'clsx';

interface IButtonProps {
	name?: string;
	imgPath?: string;
	buttonClasses?: string;
	divClasses?: string;
	imgClasses?: string;
	onClick: () => void;
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
}

const Button: React.FC<IButtonProps> = ({
	name,
	imgPath,
	buttonClasses,
	divClasses,
	imgClasses,
	onClick,
	type,
	disabled,
}) => {
	const btnClasses =
		buttonClasses && buttonClasses.length > 0
			? clsx(s.button, buttonClasses?.split(' ').map((item) => s[item]))
			: s.button;

	return (
		<button className={btnClasses} disabled={disabled} type={type} onClick={onClick}>
			{imgPath && (
				<div className={clsx(divClasses && s[divClasses])}>
					<img className={clsx(imgClasses && s[imgClasses])} src={imgPath} />
				</div>
			)}
			{name}
		</button>
	);
};

export default Button;
