import { Address, Bytes, ethereum, log } from '@graphprotocol/graph-ts';
import {
  Reserve,
  User,
  UserReserve,
  AToken,
  VToken,
  SToken
} from '../../generated/schema';
import {
  zeroBI,
} from '../utils/converters';
import { getAtokenId, getReserveId, getUserReserveId } from '../utils/id-generation';

export function getOrInitUser(address: Address): User {
  let user = User.load(address.toHexString());
  if (!user) {
    user = new User(address.toHexString());
    user.save();
  }
  return user as User;
}

export function getOrInitUserReserve(
  _user: Address,
  _underlyingAsset: Address,
  event: ethereum.Event
): UserReserve {
  let reserve = getOrInitReserve(_underlyingAsset, event);
  return initUserReserve(_underlyingAsset, _user,/* poolId,*/ reserve.id);
}

export function getOrInitReserve(underlyingAsset: Address, event: ethereum.Event): Reserve {
  let reserveId = getReserveId(underlyingAsset/*, poolId*/);
  let reserve = Reserve.load(reserveId);

  if (reserve === null) {
    reserve = new Reserve(reserveId);
    reserve.underlyingAsset = underlyingAsset;
    reserve.symbol = '';
    reserve.name = '';
    reserve.reserveLiquidationThreshold = zeroBI();
    reserve.reserveLiquidationBonus = zeroBI();
    reserve.totalATokenSupply = zeroBI();
    reserve.liquidityRate = zeroBI();
    reserve.totalScaledVariableDebt = zeroBI();
    reserve.totalCurrentVariableDebt = zeroBI();
    reserve.totalPrincipalStableDebt = zeroBI();
    reserve.totalDeposits = zeroBI();
    reserve.lastUpdateTimestamp = 0;
  }
  return reserve as Reserve;
}

function initUserReserve(
  underlyingAssetAddress: Address,
  userAddress: Address,
  //poolId: string,
  reserveId: string
): UserReserve {
  let userReserveId = getUserReserveId(userAddress, underlyingAssetAddress);
  let userReserve = UserReserve.load(userReserveId);
  if (userReserve === null) {
    userReserve = new UserReserve(userReserveId);
    userReserve.scaledATokenBalance = zeroBI();
    userReserve.scaledVariableDebt = zeroBI();
    userReserve.principalStableDebt = zeroBI();
    userReserve.currentATokenBalance = zeroBI();
    userReserve.currentVariableDebt = zeroBI();
    userReserve.currentStableDebt = zeroBI();
    userReserve.currentTotalDebt = zeroBI();
    userReserve.lastUpdateTimestamp = 0;
    userReserve.liquidityRate = zeroBI();
    userReserve.usageAsCollateralEnabled = false;
    let user = getOrInitUser(userAddress);
    userReserve.user = user.id;

    userReserve.reserve = reserveId;
  }
  return userReserve as UserReserve;
}

export function getOrInitAToken(aTokenAddress: Address): AToken {
  let aTokenId = getAtokenId(aTokenAddress);
  let aToken = AToken.load(aTokenId);
  if (!aToken) {
    aToken = new AToken(aTokenId);
    aToken.underlyingAssetAddress = new Bytes(1);
    aToken.underlyingAssetDecimals = 18;
  }
  return aToken as AToken;
}

export function getOrInitSToken(sTokenAddress: Address): SToken {
  let sTokenId = getAtokenId(sTokenAddress);
  let sToken = SToken.load(sTokenId);
  if (!sToken) {
    sToken = new SToken(sTokenId);
    sToken.underlyingAssetAddress = new Bytes(1);
    sToken.underlyingAssetDecimals = 18;
  }
  return sToken as SToken;
}

export function getOrInitVToken(vTokenAddress: Address): VToken {
  let vTokenId = getAtokenId(vTokenAddress);
  let vToken = VToken.load(vTokenId);
  if (!vToken) {
    vToken = new VToken(vTokenId);
    vToken.underlyingAssetAddress = new Bytes(1);
    vToken.underlyingAssetDecimals = 18;
  }
  return vToken as VToken;
}
