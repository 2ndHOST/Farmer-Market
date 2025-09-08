function PriceBoard({ items = [] }) {
	const data = items.length
		? items
		: [
			{ id: 1, name: 'Wheat', unit: 'kg', price: 24 },
			{ id: 2, name: 'Rice', unit: 'kg', price: 36 },
			{ id: 3, name: 'Tomato', unit: 'kg', price: 18 },
			{ id: 4, name: 'Potato', unit: 'kg', price: 22 },
		]

	return (
		<div className="card-base overflow-hidden">
			<div className="grid grid-cols-3 bg-[--color-agri-beige] text-neutral-700 text-sm font-semibold">
				<div className="px-4 py-2">Product</div>
				<div className="px-4 py-2">Unit</div>
				<div className="px-4 py-2">Price (₹)</div>
			</div>
			<ul className="divide-y divide-neutral-200">
				{data.map((row) => (
					<li key={row.id} className="grid grid-cols-3 hover:bg-neutral-50">
						<div className="px-4 py-3 font-medium">{row.name}</div>
						<div className="px-4 py-3">{row.unit}</div>
						<div className="px-4 py-3 text-[--color-agri-green] font-semibold">{row.price}</div>
					</li>
				))}
			</ul>
		</div>
	)
}

export default PriceBoard


