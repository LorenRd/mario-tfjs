import { Component } from "react";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import alertFinished from "../redux/actions/alertFinished";
import { connect } from "react-redux";

class SnackBarListener extends Component {

    render() {
        const { snackBar, alertFinished } = this.props;
        const snackBarOpen = snackBar.message !== "";
    
        return (
            <Snackbar open={snackBarOpen} autoHideDuration={5000} onClose={alertFinished}>
                <MuiAlert elevation={6} variant="filled" onClose={alertFinished} severity={snackBar.severity}>
                    {snackBar.message}
                </MuiAlert>
            </Snackbar>
        );
    }
}

const mapDispatchToProps = {
    alertFinished
};

const mapStateToProps = (state) => {
    return {
        snackBar: {
            severity: state.DataReducer.severity,
            message: state.DataReducer.message
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SnackBarListener);
