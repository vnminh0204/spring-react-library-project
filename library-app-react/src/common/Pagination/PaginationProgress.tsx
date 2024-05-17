export const PaginationProgress: React.FC<{
    currentPage: number,
    totalPages: number,
    itemsPerPage: number
    totalAmountOfItems: number,
}> = (props) => {

    const indexOfLastItem: number = props.currentPage * props.itemsPerPage;
    const indexOfFirstItem: number = indexOfLastItem - props.itemsPerPage;

    let lastItem = props.itemsPerPage * props.currentPage <= props.totalAmountOfItems ?
        props.itemsPerPage * props.currentPage : props.totalAmountOfItems;

    return (
        <p>
            {indexOfFirstItem + 1} to {lastItem} of {props.totalAmountOfItems} items:
        </p>
    )
}