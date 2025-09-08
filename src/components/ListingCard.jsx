function ListingCard({ imageUrl, title, price, sellerName, sellerPhone, onClick }) {
	return (
		<button onClick={onClick} className="w-full text-left overflow-hidden bg-white shadow-lg rounded-xl p-4 transition hover:shadow-xl hover:scale-105">
			{imageUrl ? (
				<img src={imageUrl} alt={title} className="w-full h-40 object-cover rounded-md mb-3" />
			) : (
				<div className="w-full h-40 object-cover rounded-md mb-3 bg-green-50" />
			)}
			<h3 className="font-semibold text-lg text-neutral-900">{title}</h3>
			<p className="mt-1 text-green-700 font-bold">₹ {price}</p>
			{(sellerName || sellerPhone) && (
				<div className="mt-2 text-sm text-neutral-700">
					<div><span className="font-medium">Seller:</span> {sellerName || '—'}</div>
					<div><span className="font-medium">Phone:</span> {sellerPhone || '—'}</div>
				</div>
			)}
			<p className="mt-2 text-sm text-gray-500">Tap to place a bid</p>
		</button>
	)
}

export default ListingCard


