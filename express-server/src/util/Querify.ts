export class Querify {
  constructor(public queries: any) {}

	public get search() {
		const { field, value } = this.queries;
		const item = {};

		if (field && value) {
			item[field] = { $regex: `${value}`, $options: 'i' };
		}

		return item;
	};

	public get select() {
		return this.queries.select || '-__v';
	};

	public get sort(): Array<string[]> {
		return this.queries.sort || [['createdAt', 'descending']];
	};

	public get limit() {
		return parseInt(this.queries.limit) || 99;
	};

	public get page() {
		return parseInt(this.queries.page) || 1;
	};

	public get skip() {
		const { limit, page } = this.queries;
		return (page - 1) * limit;
	}
}