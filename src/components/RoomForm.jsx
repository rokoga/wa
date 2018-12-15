import React from 'react';
import PropTypes from 'prop-types';
import { Typography, FormControl, TextField, Button } from '@material-ui/core';
import styled from 'styled-components';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { withStyles } from '@material-ui/core/styles';

const Header = styled.div`
  display: flex;
  align-items: center;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  justify-content: center;
`;

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  }
});

const RoomForm = props => {
  const { classes } = props;
  return (
    <FormControl style={{ width: '100%', height: '100%' }}>
      <Header>
        <Button onClick={props.onExitClick} className={classes.button}>
          <ArrowBack />
        </Button>
        <Typography variant="h5">Criar Chat</Typography>
      </Header>
      <InputWrapper>
        <TextField
          style={{ margin: 15, width: '70%' }}
          label="Nome"
          autoFocus={true}
        />
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={props.onAddRoomClick}
          className={classes.button}
        >
          Criar
        </Button>
      </InputWrapper>
    </FormControl>
  );
};

RoomForm.propTypes = {
  onExitClick: PropTypes.func
};

export default withStyles(styles)(RoomForm);
