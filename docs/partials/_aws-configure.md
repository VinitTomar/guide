```bash
aws configure
```
To verify your credentials are configured correctly, run below command.
```bash
aws sts get-caller-identity
```
You should get a json output like this.
```json
{
  "UserId": "someuserid",
  "Account": "someaccountid",
  "Arn": "arn:aws:iam::somid:user/aws_cli"
}
```