function ListingCard({ imageUrl, title, price, onClick }) {
	return (
		<button onClick={onClick} className="card-base w-full text-left overflow-hidden">
			{imageUrl ? (
				<img src={imageUrl} alt={title} className="h-40 w-full object-cover" />
			) : (
				<div className="h-40 w-full bg-green-50" />
			)}
			<div className="p-4">
				<h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
				<p className="mt-1 text-[--color-agri-green] font-semibold">₹ {price}</p>
				<p className="mt-2 text-sm text-neutral-600">Tap to place a bid</p>
			</div>
		</button>
	)
}

export default ListingCard


