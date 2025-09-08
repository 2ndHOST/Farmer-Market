function BidModal({ open, onClose, onSubmit, defaultCrop, defaultFarmer }) {
	if (!open) return null
	function handleSubmit(e) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		onSubmit?.({
			price: formData.get('price'),
			quantity: formData.get('quantity'),
			phone: formData.get('phone'),
			address: formData.get('address'),
			crop: formData.get('crop') || defaultCrop,
			farmerName: formData.get('farmerName') || defaultFarmer,
		})
	}
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 px-4">
			<div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6">
				<h3 className="text-xl font-semibold text-green-700 mb-4">Place a Bid</h3>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input name="crop" type="text" defaultValue={defaultCrop} placeholder="Crop" className="w-full border rounded-md p-2" />
					<input name="price" type="number" min="0" step="1" placeholder="Bid Price (₹)" className="w-full border rounded-md p-2" />
					<input name="quantity" type="number" min="0" step="1" placeholder="Quantity" className="w-full border rounded-md p-2" />
					<input name="phone" type="tel" placeholder="Contact Number" className="w-full border rounded-md p-2" />
					<input name="address" type="text" placeholder="Address" className="w-full border rounded-md p-2" />
					<input name="farmerName" type="text" defaultValue={defaultFarmer} placeholder="Your Name" className="w-full border rounded-md p-2" />
					<div className="flex items-center justify-end gap-3">
						<button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
						<button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow">Place Bid</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default BidModal


