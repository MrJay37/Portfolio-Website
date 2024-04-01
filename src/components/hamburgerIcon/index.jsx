import './hamburgerIcon.scss'

export default function HambugerButton({ clicked=false, onClick }) {
    let cn = 'hmbIconContainer flex' 

    if (clicked) cn += 'hmbIconButtonOpen'

	return <div className={cn}>
		<button onClick={onClick} >
			<span /> <span /> <span />
		</button>
	</div>
}