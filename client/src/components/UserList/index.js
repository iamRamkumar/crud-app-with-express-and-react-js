/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Cookies from 'js-cookie';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Fade from '@material-ui/core/Fade';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DeleteIcon from '@material-ui/icons/Delete';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import EditIcon from '@material-ui/icons/Edit';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import RemoveDialog from './RemoveDialog';
import DupContactDialog from './DupContactDialog';
import RenameDialog from './RenameDialog';

export default function UserList() {
    const [userList, setUserList] = useState();

    const [selected, setSelected] = useState('');
    const [endpoint, setEndpoint] = useState('');
    const [userID, setUserID] = useState('');
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('leadscore');
    const isSelected = (name) => selected.indexOf(name) !== -1;
    const [anchorEl, setAnchorEl] = useState(null);

    const isLoggedin = Cookies.get('isLoggedin') || false;
    const history = useHistory();

    const pushRoutee = () => {
        history.push('/dashboard');
    };
    
    useEffect(() => {
        if (!JSON.parse(isLoggedin)) {
            pushRoutee();
        }
    }, []);

    useEffect(() => {
        if (!JSON.parse(isLoggedin)) {
            pushRoutee()
        };
    }, [isLoggedin]);

    const handleClose = () => {
        setAnchorEl(null);
        setSelected('')
    };

    const [removeDialogStatus, setRemoveDialogStatus] = useState(false);
    const [copyDialogStatus, setCopyDialogStatus] = useState(false);
    const [renameDialogStatus, setRenameDialogStatus] = useState(false);
    const [copyContactName, setCopyContactName] = useState('');

    const handleRemoveDialogClose = () => {
        setRemoveDialogStatus(false);
    };

    const handleCopyDialogClose = () => {
        setCopyDialogStatus(false);
    };
    
    const handleEditDialogClose = () => {
        setRenameDialogStatus(false);
    };

    const useStyles = makeStyles((theme) => ({
        table: {
            minWidth: 750,
        },
        tagTableHead: {
            backgroundColor: theme.palette.common.black,
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
        tagTableCell: {
            maxWidth: '360px',
        },
        chip: {
            margin: theme.spacing(0.5),
        },
    }));

    const classes = useStyles();

    const callApi = async () => {
        const response = await fetch('/api/user/get-user-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    useEffect(() => {
        callApi()
            .then(res => setUserList(res.userList))
            .catch(err => console.log(err))
    }, []);

    const headCells = [
        { id: '', numeric: false, disablePadding: true, label: '' },
        { id: 'basicInfo', numeric: false, disablePadding: true, label: 'Basic Info' },
        { id: 'company', numeric: false, disablePadding: false, label: 'Company' },
        { id: 'leadscore', numeric: true, disablePadding: false, label: 'Lead Score' },
        { id: 'phone', numeric: false, disablePadding: false, label: 'Phone' },
        { id: 'tags', numeric: false, disablePadding: false, label: 'Tags' },
        { id: 'createdDate', numeric: true, disablePadding: false, label: 'Created Date' },
    ];

    const doRenameAction = async () => {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: userID }),
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        setUserList(body.userList);
        handleRemoveDialogClose();
    };

    const doCopyAction = async () => {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: userID, name: copyContactName }),
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        setUserList(body.userList);
        handleCopyDialogClose();
    };

    const doEditAction = async () => {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: userID, name: copyContactName }),
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        setUserList(body.userList);
        handleEditDialogClose();
    };

    const handleContactActions = (contactActions) => {
        const { id, action } = contactActions;
        setUserID(id);
        switch (action) {
            case 'edit':
                setEndpoint('/api/contact/rename');
                setRenameDialogStatus(true);
                break;
            case 'remove':
                setEndpoint('/api/contact/remove');
                setRemoveDialogStatus(true);
                break;
            case 'copy':
                setEndpoint('/api/contact/copy');
                setCopyDialogStatus(true);
                break;
            default: break;
        }
        handleClose();
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    const descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    const getComparator = (order, orderBy) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const handleClick = (event, data) => {
        const { name } = data;
        setSelected(name);
        setAnchorEl(event.currentTarget);
    };

    const TableHeader = () => {
        const createSortHandler = (property) => (event) => {
            handleRequestSort(event, property);
        };

        return (
            <TableHead>
                <TableRow>
                    {
                        headCells.map((headCell) => (
                            <TableCell
                                key={headCell.id}
                                sortDirection={orderBy === headCell.id ? order : false}
                            >
                                {
                                    headCell.id ? (
                                        <TableSortLabel
                                            active={orderBy === headCell.id}
                                            direction={orderBy === headCell.id ? order : 'asc'}
                                            onClick={createSortHandler(headCell.id)}
                                        >
                                            {headCell.label}
                                            {
                                                orderBy === headCell.id ? (
                                                    <span className={classes.visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </span>
                                                ) : null
                                            }
                                        </TableSortLabel>
                                    ) : <br />
                                }
                            </TableCell>
                        ))
                    }
                </TableRow>
            </TableHead>
        );
    };

    return (
        <>
            <TableContainer>
                <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size="medium"
                    aria-label="enhanced table"
                >
                    <TableHeader />
                    <TableBody>
                        {
                            userList && stableSort(userList, getComparator(order, orderBy)).map((row, index) => {
                                const isItemSelected = isSelected(row.name);
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.name}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="none" align="left">
                                            <Avatar padding="none" alt="Remy Sharp" src={row.picture} />
                                        </TableCell>
                                        <TableCell padding="none" align="left">
                                            <Typography align="left" variant="subtitle1" display="block" gutterBottom>
                                                {row.name}
                                            </Typography>
                                            <Typography align="left" variant="caption" display="block" gutterBottom>
                                                {row.email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left">{row.company}</TableCell>
                                        <TableCell align="left">{row.leadscore}</TableCell>
                                        <TableCell align="left">{row.phone}</TableCell>
                                        <TableCell padding="none" className={classes.tagTableCell} size="small" align="left">
                                            {
                                                row.tags.map(tag => <Chip label={tag} className={classes.chip} />)
                                            }
                                        </TableCell>
                                        <TableCell align="left">{moment(new Date(row.registered)).format('DD MMM YYYY')}</TableCell>
                                        <TableCell align="left">
                                            <MoreHorizIcon onClick={(event) => handleClick(event, row)} />
                                                <Menu
                                                    id={`${row._id}anchorEl`}
                                                    anchorEl={anchorEl}
                                                    getContentAnchorEl={null}
                                                    open={isItemSelected}
                                                    keepMounted
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: '78%',
                                                    }}
                                                    onClose={handleClose}
                                                    TransitionComponent={Fade}
                                                >

                                                    <MenuItem
                                                        onClick={() => handleContactActions({
                                                            id: row._id,
                                                            action: 'edit',
                                                        })}
                                                    >
                                                        <ListItemIcon>
                                                            <EditIcon fontSize="small" />
                                                        </ListItemIcon>
                                                        <Typography variant="inherit">Edit Contact</Typography>
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() => handleContactActions({
                                                            id: row._id,
                                                            action: 'remove',
                                                        })}
                                                    >
                                                        <ListItemIcon>
                                                            <DeleteIcon fontSize="small" />
                                                        </ListItemIcon>
                                                        <Typography variant="inherit">Remove</Typography>
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() => handleContactActions({
                                                            id: row._id,
                                                            action: 'copy',
                                                        })}
                                                    >
                                                        <ListItemIcon>
                                                            <AddToPhotosIcon fontSize="small" />
                                                        </ListItemIcon>
                                                        <Typography variant="inherit">Duplicate</Typography>
                                                    </MenuItem>
                                                </Menu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <RemoveDialog confirmAction={doRenameAction} open={removeDialogStatus} handleClose={handleRemoveDialogClose} />
            <DupContactDialog confirmAction={doCopyAction} setCopyContactName={setCopyContactName} copyContactName={copyContactName} open={copyDialogStatus} handleClose={handleCopyDialogClose} />
            <RenameDialog confirmAction={doEditAction} setCopyContactName={setCopyContactName} copyContactName={copyContactName} open={renameDialogStatus} handleClose={handleEditDialogClose} />
        </>
    );
}