const UTILS = {
	calculatePageSizeForMainTable(
		rowHeight: number = 48,
		extraElements?: string[],
		extraHeight?: number
	) {
		const tableContainer = getElementHeight(
			document.getElementsByClassName("main-layout")[0] as HTMLElement
		);
		const buttonBar = getElementHeight(
			document.getElementsByClassName("page--options")[0] as HTMLElement
		);
		const tableHeader = getElementHeight(
			document.querySelector("main .ant-table-thead") as HTMLElement
		);
		const paginationBar = 56;

		let tableAvailableHeight =
			tableContainer -
			buttonBar -
			tableHeader -
			paginationBar -
			16 * 4; /*button bar and table margins*/
		return {
			limit: Math.floor(tableAvailableHeight / rowHeight) || 1,
			tableBodyHeight: tableAvailableHeight,
		};
	},
	calculatePageSizeForMainTableOther(rowHeight: number = 48, extraElements?: string[], extraHeight?: number) {

        const header = getElementHeight(document.getElementsByClassName('ant-layout-header')[0] as HTMLElement);
        const tabBar = getElementHeight(document.getElementsByClassName('ant-tabs-nav')[0] as HTMLElement);
        const buttonBar = getElementHeight(document.querySelector('main > .ant-tabs > .ant-tabs-content-holder > .ant-tabs-content > .ant-tabs-tabpane-active .table-button-bar') as HTMLElement);
        const tableHeader = getElementHeight(document.querySelector('main > .ant-tabs > .ant-tabs-content-holder > .ant-tabs-content > .ant-tabs-tabpane-active .ant-table-thead') as HTMLElement);
        const paginationBar = 56;

        let tableAvailableHeight = header + tabBar + buttonBar + tableHeader + paginationBar;

        let extraElementsHeight = 0;
        if (extraElements) {
            const existsTabPanel = document.getElementsByClassName('.ant-tabs-tabpane-active').length > 0;
            extraElementsHeight = extraElements.map(e => {
                const elementSelector = existsTabPanel ? '.ant-tabs-tabpane-active .' + e : '.' + e;
                return getElementHeight(document.querySelector(elementSelector) as HTMLElement)
            }).reduce((totalHeight, elementHeight) => totalHeight + elementHeight);

            tableAvailableHeight += extraElementsHeight;
        }

        if (extraHeight) {
            tableAvailableHeight += extraHeight;
        }

        return { limit: Math.floor((window.innerHeight - tableAvailableHeight) / rowHeight), tableBodyHeight: window.innerHeight - tableAvailableHeight}
    }
};

export default UTILS;

export interface MainTableBodyProps {
	limit: number;
	tableBodyHeight?: number;
}

function getElementHeight(element: HTMLElement): number {
	if (element) {
		let height = element.clientHeight;

		var computedStyle = window.getComputedStyle(element);
		height += parseInt(computedStyle.marginTop, 10);
		height += parseInt(computedStyle.marginBottom, 10);
		height += parseInt(computedStyle.borderTopWidth, 10);
		height += parseInt(computedStyle.borderBottomWidth, 10);
		return height;
	} else {
		return 0;
	}
}
