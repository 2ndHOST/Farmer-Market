function BidModal({ open, onClose, onSubmit }) {
	if (!open) return null
	function handleSubmit(e) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		onSubmit?.({ amount: formData.get('amount') })
	}
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
			<div className="w-full max-w-md card-base p-6 bg-white">
				<h3 className="text-xl font-semibold text-neutral-900">Place a Bid</h3>
				<form onSubmit={handleSubmit} className="mt-4 space-y-4">
					<input name="amount" type="number" min="0" step="1" placeholder="Enter amount"
						className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[--color-agri-green]" />
					<div className="flex items-center justify-end gap-3">
						<button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200">Cancel</button>
						<button type="submit" className="btn-primary">Submit Bid</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default BidModal


