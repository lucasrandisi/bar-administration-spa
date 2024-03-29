import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import REMOVE_CATEGORY_FROM_ITEM from "./queries/remove-category-from-item.mutation";
import ItemForm from "./itemForm";

import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import BasicModal from "utils/basicModal";
import { DELETE_ITEM } from "./queries/item";
import GET_CATEGORIES_AND_ITEMS from "./queries/categories-and-items.query";
import { toast } from "react-toastify";

const useStyles = makeStyles({
	tableRow: {
		height: "3vh",
		borderBottom: "2px solid #bdb5b58a",
	},

	tableCell: {
		fontSize: "1rem",
		padding: "0 1vw",
	},

	header: {
		fontWeight: "bold",
		padding: "0 1vw 1vh",
	},

	// Title
	titleCell: {
		width: "30%",
		paddingLeft: 0,
	},

	// Desc
	descCell: {
		width: "40%",
	},

	// Servings, Price
	shortCell: {
		width: "4%",
	},

	// Actions
	actionsCell: {
		display: "flex",
		justifyContent: "center",
	},

	button: {
		padding: "6px",
	},
});

export default function ItemsList({ selectedCategoryId, items }) {
	/* eslint no-use-before-define: ["error", { "functions": false }] */
	const [removeCategoryFromItem] = useMutation(REMOVE_CATEGORY_FROM_ITEM);
	const classes = useStyles();

	function removeSelectedCategoryFromItem(targetItem) {
		const filteredCategoriesId = targetItem.categories
			.filter(category => category.id !== selectedCategoryId)
			.map(category => category.id);

		removeCategoryFromItem({
			variables: {
				id: targetItem.id,
				itemInput: {
					categoriesId: filteredCategoriesId,
				},
			},
			update: (cache, result) =>
				updateCacheAfterCategoryRemovedFromItem(cache, result, targetItem),
		});
	}

	function updateCacheAfterCategoryRemovedFromItem(cache, result, targetItem) {
		if (result) {
			cache.modify({
				id: cache.identify(targetItem),
				fields: {
					categories: () => result.categories,
				},
			});
		}
	}

	const [deleteItem] = useMutation(DELETE_ITEM, {
		refetchQueries: [{ query: GET_CATEGORIES_AND_ITEMS }],
	});

	const handleDelete = (id) => {
		console.log(id)
		deleteItem({ variables: { id:id } })
		toast.success("The item has been successfully deleted");
	}

	const [childrenModal, setChildrenModal] = useState<any>(null);

	const handleModal = (type, item=null) => {
		switch (type) {
			case "edit":
				setChildrenModal(
					<ItemForm 
						setChildrenModal={setChildrenModal}
						values={item}
						isEdit={true}
						title="Editing dishes"
					/>
				)
				break;
			case "delete":
				setChildrenModal(
					<BasicModal
						setChildrenModal={setChildrenModal}
						title="Delete item from menu"
						buttonText="Delete"
						handleAction={() => handleDelete(item)}
					>
						Si acepta se procederá a eliminar el item del menú. ¿Está seguro?
					</BasicModal>
				)
				break;
		}
	}

	if (!items.length) return <div>No hay platos.</div>;

	return (
		<Table aria-label="table">
			<TableHead>
				<TableRow className={classes.tableRow}>
					<TableCell
						className={`${classes.tableCell} ${classes.header} ${classes.titleCell}`}>
						Title
					</TableCell>
					<TableCell
						className={`${classes.tableCell} ${classes.header} ${classes.descCell}`}>
						Description
					</TableCell>
					<TableCell
						className={`${classes.tableCell} ${classes.header} ${classes.descCell}`}>
						Categoria
					</TableCell>
					<TableCell
						className={`${classes.tableCell} ${classes.header} ${classes.shortCell}`}>
						Servings
					</TableCell>
					<TableCell
						className={`${classes.tableCell} ${classes.header} ${classes.shortCell}`}>
						Price
					</TableCell>
					<TableCell
						className={`${classes.tableCell} ${classes.header} ${classes.shortCell}`}>
						Actions
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{items.map((item, i) => (
					<TableRow key={item.id} className={classes.tableRow}>
						<TableCell
							padding="none"
							className={`${classes.tableCell} ${classes.titleCell}`}>
							{item.title}
						</TableCell>
						<TableCell
							padding="none"
							className={`${classes.tableCell} ${classes.descCell}`}>
							{item.desc}
						</TableCell>
						<TableCell
							padding="none"
							className={`${classes.tableCell} ${classes.descCell}`}>
							{item.categories.map(i => i.desc).join()}
						</TableCell>
						<TableCell
							padding="none"
							className={`${classes.tableCell} ${classes.shortCell}`}>
							{item.servings}
						</TableCell>
						<TableCell
							padding="none"
							className={`${classes.tableCell} ${classes.shortCell}`}>
							${item.pricePerUnit}
						</TableCell>
						<TableCell className={`${classes.tableCell} ${classes.actionsCell}`}>
							{selectedCategoryId === "0" ? (
								<>
									<Tooltip title="Edit">
										<IconButton className={classes.button} aria-label="edit"
											onClick={() => handleModal("edit", item)}
										>
											<EditIcon />
										</IconButton>
									</Tooltip>
									<Tooltip title="Delete">
										<IconButton className={classes.button} aria-label="delete"
											onClick={() => handleModal("delete", item.id)}
										>
											<DeleteIcon />
										</IconButton>
									</Tooltip>
								</>
							) : (
								<Tooltip title="Remove from category">
									<IconButton
										className={classes.button}
										aria-label="delete"
										onClick={() => removeSelectedCategoryFromItem(item)}>
										<CloseIcon />
									</IconButton>
								</Tooltip>
							)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
			{childrenModal}
		</Table>
	);
}
